import { Router, Request, Response } from 'express';
import { db } from '../db';
import { AIService } from '../services/aiService';
import { JobService } from '../services/jobService';
import { ApplicationService } from '../services/applicationService';
import { TelegramService } from '../services/telegramService';
import { EmailService } from '../services/emailService';
import { AgentLoop } from '../services/agentLoop';
import { SchedulerService } from '../services/schedulerService';

export const apiRouter = Router();

// --- Auth Endpoints ---
apiRouter.post('/auth/login', (req: Request, res: Response) => {
  res.json({
    token: 'jwt_mock_token_jobagent_7781',
    user: {
      id: 'user_01',
      name: db.getProfile().name,
      email: db.getProfile().email,
    },
  });
});

// --- Resume & Candidate Profile Endpoints ---
apiRouter.get('/resume/profile', (req: Request, res: Response) => {
  res.json(db.getProfile());
});

apiRouter.put('/resume/profile', (req: Request, res: Response) => {
  const updated = db.updateProfile(req.body);
  res.json(updated);
});

apiRouter.post('/resume/parse', async (req: Request, res: Response) => {
  try {
    const { resumeText } = req.body;
    if (!resumeText) {
      return res.status(400).json({ error: 'resumeText is required' });
    }
    const extracted = await AIService.parseResume(resumeText);
    const updated = db.updateProfile(extracted);
    res.json({
      success: true,
      message: 'Resume parsed and profile updated successfully.',
      profile: updated,
    });
  } catch (err: any) {
    res.status(500).json({ error: err.message || 'Failed to parse resume' });
  }
});

// --- Jobs Endpoints ---
apiRouter.get('/jobs', (req: Request, res: Response) => {
  const jobs = db.getJobs();
  const matches = db.getMatches();

  const enriched = jobs.map((job) => {
    const match = matches.find((m) => m.jobId === job.id);
    const app = db.getApplicationByJobId(job.id);
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
  const job = db.getJobById(req.params.id);
  if (!job) return res.status(404).json({ error: 'Job not found' });
  const match = db.getMatchByJobId(job.id);
  const application = db.getApplicationByJobId(job.id);
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
    const { url, rawText } = req.body;
    if (!url && !rawText) {
      return res.status(400).json({ error: 'Either url or rawText is required' });
    }
    const newJob = await JobService.ingestCustomJob({ url, rawText });
    const profile = db.getProfile();
    const match = await AIService.matchJob(profile, newJob);
    db.saveMatch(match);
    res.json({ success: true, job: newJob, match });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/jobs/:id/match', async (req: Request, res: Response) => {
  try {
    const job = db.getJobById(req.params.id);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    const profile = db.getProfile();
    const match = await AIService.matchJob(profile, job);
    db.saveMatch(match);
    res.json(match);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/jobs/match-all', async (req: Request, res: Response) => {
  try {
    const result = await JobService.matchAllUnmatchedJobs();
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- Applications Endpoints ---
apiRouter.get('/applications', (req: Request, res: Response) => {
  res.json(db.getApplications());
});

apiRouter.get('/applications/:id', (req: Request, res: Response) => {
  const app = db.getApplicationById(req.params.id);
  if (!app) return res.status(404).json({ error: 'Application not found' });
  const job = db.getJobById(app.jobId);
  res.json({ ...app, job });
});

apiRouter.post('/applications/prepare', async (req: Request, res: Response) => {
  try {
    const { jobId } = req.body;
    if (!jobId) return res.status(400).json({ error: 'jobId is required' });
    const app = await ApplicationService.prepareApplication(jobId);
    res.json(app);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.post('/applications/:id/approve', async (req: Request, res: Response) => {
  try {
    const { editedFields, editedCoverLetter } = req.body;
    const app = await ApplicationService.approveAndSubmit(
      req.params.id,
      editedFields,
      editedCoverLetter
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
    const { status, note } = req.body;
    const app = ApplicationService.updateStatus(req.params.id, status, note, 'user');
    res.json(app);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.delete('/applications/:id', (req: Request, res: Response) => {
  const success = db.deleteApplication(req.params.id);
  res.json({ success });
});

// --- Cover Letter Endpoints ---
apiRouter.post('/cover-letter/generate', async (req: Request, res: Response) => {
  try {
    const { jobId, tone } = req.body;
    const job = db.getJobById(jobId);
    if (!job) return res.status(404).json({ error: 'Job not found' });
    const profile = db.getProfile();
    const letter = await AIService.generateCoverLetter(profile, job, tone || 'professional');
    db.saveCoverLetter(letter);
    res.json(letter);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- AI Autonomous Agent Loop Endpoints ---
apiRouter.post('/agent/run', async (req: Request, res: Response) => {
  try {
    const { goal, minMatchScore } = req.body;
    const session = await AgentLoop.runAutonomousAgent(
      goal || 'Find suitable backend/full stack roles, score matches, and prepare applications awaiting approval.',
      minMatchScore || 80
    );
    res.json(session);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

apiRouter.get('/agent/sessions', (req: Request, res: Response) => {
  res.json(db.getAgentSessions());
});

// --- Telegram & Notifications Endpoints ---
apiRouter.get('/notifications', (req: Request, res: Response) => {
  res.json(db.getNotifications());
});

apiRouter.patch('/notifications/:id/read', (req: Request, res: Response) => {
  db.markNotificationRead(req.params.id);
  res.json({ success: true });
});

apiRouter.post('/notifications/clear', (req: Request, res: Response) => {
  db.clearNotifications();
  res.json({ success: true });
});

apiRouter.get('/notifications/telegram/config', (req: Request, res: Response) => {
  res.json(db.getTelegramConfig());
});

apiRouter.put('/notifications/telegram/config', (req: Request, res: Response) => {
  const updated = db.updateTelegramConfig(req.body);
  res.json(updated);
});

apiRouter.post('/notifications/telegram/test', async (req: Request, res: Response) => {
  try {
    const result = await TelegramService.sendTelegramNotification(
      '🚀 *JobAgent Telegram Link Verified!*\n\nYour autonomous job search notifications and approval requests will appear here in real time.',
      'system_alert',
      'Telegram Test Message'
    );
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- Email Monitor & Outbound Endpoints ---
apiRouter.get('/email/inbox', (req: Request, res: Response) => {
  res.json(db.getEmails());
});

apiRouter.get('/email/config', (req: Request, res: Response) => {
  res.json(db.getEmailDispatchConfig());
});

apiRouter.put('/email/config', (req: Request, res: Response) => {
  const updated = db.updateEmailDispatchConfig(req.body);
  res.json(updated);
});

apiRouter.post('/email/test', async (req: Request, res: Response) => {
  try {
    const { recipientEmail } = req.body;
    const target = recipientEmail || db.getEmailDispatchConfig().recipientEmail || 'codepankaj84@gmail.com';
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

// --- Scheduler Endpoints ---
apiRouter.get('/scheduler', (req: Request, res: Response) => {
  res.json(db.getSchedulerConfig());
});

apiRouter.put('/scheduler', (req: Request, res: Response) => {
  const updated = db.updateSchedulerConfig(req.body);
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
    const { targetCount, autoSubmit } = req.body;
    const result = await SchedulerService.runMorningRoutineNow(targetCount || 5, autoSubmit !== false);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- Agent Morning Routine Direct Trigger ---
apiRouter.post('/agent/morning-routine', async (req: Request, res: Response) => {
  try {
    const { targetCount, autoSubmit } = req.body;
    const result = await AgentLoop.runMorningRoutine(targetCount || 5, autoSubmit !== false);
    res.json(result);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// --- Dashboard & Analytics Endpoints ---
apiRouter.get('/dashboard/stats', (req: Request, res: Response) => {
  res.json(db.getDashboardStats());
});

apiRouter.post('/reset-demo', (req: Request, res: Response) => {
  db.resetToDefaults();
  res.json({ success: true, message: 'Reset to demo baseline successfully.' });
});
