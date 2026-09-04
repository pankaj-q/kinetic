import { Router, Request, Response } from 'express';
import { db, PRIMARY_USER, DEMO_USER } from '../db';
import { AIService } from '../services/aiService';
import { JobService } from '../services/jobService';
import { ApplicationService } from '../services/applicationService';
import { TelegramService } from '../services/telegramService';
import { EmailService } from '../services/emailService';
import { AgentLoop } from '../services/agentLoop';
import { SchedulerService } from '../services/schedulerService';

export const apiRouter = Router();

// Helper to extract userId from request headers with graceful fallback to primary user
function getUserId(req: Request): string {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.slice(7).trim();
    if (token.startsWith('token_')) {
      const extracted = token.replace('token_', '').trim();
      if (extracted) return extracted;
    }
  }
  const headerUserId = req.headers['x-user-id'];
  if (typeof headerUserId === 'string' && headerUserId.trim()) {
    return headerUserId.trim();
  }
  return PRIMARY_USER.id;
}

// --- Multi-User Auth Endpoints ---
apiRouter.get('/auth/me', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const user = db.getUserById(userId) || PRIMARY_USER;
  res.json({
    user,
    token: `token_${user.id}`,
  });
});

apiRouter.get('/auth/users', (req: Request, res: Response) => {
  res.json(db.getUsers());
});

apiRouter.post('/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, role } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const result = db.createUser(name || 'New Candidate', email, role);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/auth/login', (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Email is required' });
    }
    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.json({
        user: existing,
        token: `token_${existing.id}`,
      });
    }
    const result = db.createUser(name || 'Candidate', email);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/auth/switch-demo', (req: Request, res: Response) => {
  const result = db.getDemoUser();
  res.json(result);
});

apiRouter.post('/auth/switch-primary', (req: Request, res: Response) => {
  const result = db.getPrimaryUser();
  res.json(result);
});

// --- Resume & Candidate Profile Endpoints ---
apiRouter.get('/resume/profile', (req: Request, res: Response) => {
  const userId = getUserId(req);
  res.json(db.getProfile(userId));
});

apiRouter.put('/resume/profile', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const updated = db.updateProfile(req.body, userId);
  res.json(updated);
});

apiRouter.post('/resume/parse', async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { resumeText } = req.body;
    if (!resumeText) {
      return res.status(400).json({ error: 'resumeText is required' });
    }
    const extracted = await AIService.parseResume(resumeText);
    const updated = db.updateProfile(extracted, userId);
    res.json({
      success: true,
      message: 'Resume parsed and profile updated successfully.',
      profile: updated,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to parse resume' });
  }
});

// --- Jobs Endpoints (Shared pool with user-scoped match & status) ---
apiRouter.get('/jobs', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const jobs = db.getJobs();
  const matches = db.getMatches(userId);

  const enriched = jobs.map((job) => {
    const match = matches.find((m) => m.jobId === job.id);
    const app = db.getApplicationByJobId(job.id, userId);
    return {
      ...job,
      match,
      applicationId: app?.id,
      applicationStatus: app?.status,
    };
  });

  res.json(enriched);
});

apiRouter.get('/jobs/:id', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const job = db.getJobById(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  const match = db.getMatchByJobId(job.id, userId);
  const application = db.getApplicationByJobId(job.id, userId);
  res.json({ ...job, match, application });
});

apiRouter.post('/jobs/search', async (req: Request, res: Response) => {
  try {
    const { query, sources } = req.body;
    const result = await JobService.searchAndIngestJobs(query, sources);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/jobs/ingest-custom', async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { url, rawText } = req.body;
    if (!url && !rawText) {
      return res.status(400).json({ error: 'Either url or rawText is required' });
    }
    const newJob = await JobService.ingestCustomJob({ url, rawText });
    const profile = db.getProfile(userId);
    const match = await AIService.matchJob(profile, newJob);
    db.saveMatch(match, userId);
    res.json({ success: true, job: newJob, match });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/jobs/:id/match', async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const job = db.getJobById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    const profile = db.getProfile(userId);
    const match = await AIService.matchJob(profile, job);
    db.saveMatch(match, userId);
    res.json(match);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/jobs/match-all', async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const result = await JobService.matchAllUnmatchedJobs(undefined, userId);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- Applications Endpoints (User-Scoped) ---
apiRouter.get('/applications', (req: Request, res: Response) => {
  const userId = getUserId(req);
  res.json(db.getApplications(userId));
});

apiRouter.get('/applications/:id', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const app = db.getApplicationById(req.params.id, userId);
  if (!app) return res.status(404).json({ error: 'Application not found' });
  const job = db.getJobById(app.jobId);
  res.json({ ...app, job });
});

apiRouter.post('/applications/prepare', async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { jobId } = req.body;
    if (!jobId) return res.status(400).json({ error: 'jobId is required' });
    const app = await ApplicationService.prepareApplication(jobId, userId);
    res.json(app);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/applications/:id/approve', async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { editedFields, editedCoverLetter } = req.body;
    const app = await ApplicationService.approveAndSubmit(
      req.params.id,
      editedFields,
      editedCoverLetter,
      userId
    );
    res.json({
      success: true,
      message: 'Application approved and submitted successfully.',
      application: app,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.patch('/applications/:id/status', (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { status, note } = req.body;
    const app = ApplicationService.updateStatus(req.params.id, status, note, 'user', userId);
    res.json(app);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/applications/:id', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const success = db.deleteApplication(req.params.id, userId);
  res.json({ success });
});

// --- Cover Letter Endpoints (User-Scoped) ---
apiRouter.post('/cover-letter/generate', async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { jobId, tone } = req.body;
    const job = db.getJobById(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    const profile = db.getProfile(userId);
    const letter = await AIService.generateCoverLetter(profile, job, tone || 'professional');
    db.saveCoverLetter(letter, userId);
    res.json(letter);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- AI Autonomous Agent Loop Endpoints (User-Scoped) ---
apiRouter.post('/agent/run', async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { goal, minMatchScore } = req.body;
    const session = await AgentLoop.runAutonomousAgent(
      goal || 'Find suitable backend/full stack roles, score matches, and prepare applications awaiting approval.',
      minMatchScore || 80,
      undefined,
      userId
    );
    res.json(session);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/agent/sessions', (req: Request, res: Response) => {
  const userId = getUserId(req);
  res.json(db.getAgentSessions(userId));
});

// --- Telegram & Notifications Endpoints (User-Scoped) ---
apiRouter.get('/notifications', (req: Request, res: Response) => {
  const userId = getUserId(req);
  res.json(db.getNotifications(userId));
});

apiRouter.patch('/notifications/:id/read', (req: Request, res: Response) => {
  const userId = getUserId(req);
  db.markNotificationRead(req.params.id, userId);
  res.json({ success: true });
});

apiRouter.post('/notifications/clear', (req: Request, res: Response) => {
  const userId = getUserId(req);
  db.clearNotifications(userId);
  res.json({ success: true });
});

apiRouter.get('/notifications/telegram/config', (req: Request, res: Response) => {
  const userId = getUserId(req);
  res.json(db.getTelegramConfig(userId));
});

apiRouter.put('/notifications/telegram/config', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const updated = db.updateTelegramConfig(req.body, userId);
  res.json(updated);
});

apiRouter.post('/notifications/telegram/test', async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const result: any = await TelegramService.sendTelegramNotification(
      '🚀 *Kinetic Telegram Link Verified!*\n\nYour autonomous job search notifications, 10:00 AM routines, and approval alerts will appear here in real time.',
      'system_alert',
      'Telegram Test Alert',
      undefined,
      userId
    );
    if (!result.deliveredToTelegram) {
      return res.status(400).json({
        success: false,
        error: result.deliveryError || 'Failed to deliver message to Telegram. Make sure you pressed /start on your bot and your Bot Token & Chat ID are correct.',
      });
    }
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- Email Monitor & Outbound Endpoints (User-Scoped) ---
apiRouter.get('/email/inbox', (req: Request, res: Response) => {
  const userId = getUserId(req);
  res.json(db.getEmails(userId));
});

apiRouter.get('/email/config', (req: Request, res: Response) => {
  const userId = getUserId(req);
  res.json(db.getEmailDispatchConfig(userId));
});

apiRouter.put('/email/config', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const updated = db.updateEmailDispatchConfig(req.body, userId);
  res.json(updated);
});

apiRouter.post('/email/test', async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { recipientEmail } = req.body;
    const target = recipientEmail || db.getEmailDispatchConfig(userId).recipientEmail || 'codepankaj84@gmail.com';
    const result = await EmailService.sendTestEmail(target);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/email/simulate', async (req: Request, res: Response) => {
  try {
    const { type, company } = req.body;
    const result = await EmailService.simulateRecruiterEmail(type || 'interview', company);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/email/process', async (req: Request, res: Response) => {
  try {
    const { sender, recipient, subject, body } = req.body;
    const result = await EmailService.processEmail({ sender, recipient, subject, body });
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- Scheduler Endpoints (User-Scoped) ---
apiRouter.get('/scheduler', (req: Request, res: Response) => {
  const userId = getUserId(req);
  res.json(db.getSchedulerConfig(userId));
});

apiRouter.put('/scheduler', (req: Request, res: Response) => {
  const userId = getUserId(req);
  const updated = db.updateSchedulerConfig(req.body, userId);
  SchedulerService.startScheduler();
  res.json(updated);
});

apiRouter.post('/scheduler/trigger-now', async (req: Request, res: Response) => {
  try {
    const result = await SchedulerService.runScheduledCycle();
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/scheduler/morning-routine', async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { targetCount, autoSubmit } = req.body;
    const result = await AgentLoop.runMorningRoutine(targetCount || 5, autoSubmit !== false, undefined, userId);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- Agent Morning Routine Direct Trigger ---
apiRouter.post('/agent/morning-routine', async (req: Request, res: Response) => {
  try {
    const userId = getUserId(req);
    const { targetCount, autoSubmit } = req.body;
    const result = await AgentLoop.runMorningRoutine(targetCount || 5, autoSubmit !== false, undefined, userId);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- Dashboard & Analytics Endpoints (User-Scoped) ---
apiRouter.get('/dashboard/stats', (req: Request, res: Response) => {
  const userId = getUserId(req);
  res.json(db.getDashboardStats(userId));
});

apiRouter.post('/reset-demo', (req: Request, res: Response) => {
  const userId = getUserId(req);
  db.resetToDefaults(userId);
  res.json({ success: true, message: 'Reset to demo baseline successfully.' });
});

