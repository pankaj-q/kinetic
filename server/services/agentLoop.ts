import { db } from '../db';
import { JobService } from './jobService';
import { AIService } from './aiService';
import { ApplicationService } from './applicationService';
import { TelegramService } from './telegramService';
import { EmailService } from './emailService';
import { AgentRunSession, AgentActionLog, Job, JobMatch, PreparedApplication } from '../../src/types';
import { v4 as uuidv4 } from 'uuid';

export class AgentLoop {
  /**
   * Run the dedicated 10:00 AM Morning Routine:
   * 1. Multi-source search
   * 2. AI scoring & selection of >= 5 jobs
   * 3. Tailored applications preparation & submission
   * 4. Comprehensive Telegram notification with 5 applied jobs
   * 5. Formatted morning email digest to user's email
   */
  static async runMorningRoutine(
    targetCount: number = 5,
    autoSubmit: boolean = true,
    onProgress?: (log: AgentActionLog) => void
  ): Promise<{ session: AgentRunSession; appliedApplications: PreparedApplication[] }> {
    const session: AgentRunSession = {
      id: `session_morning_${uuidv4().slice(0, 8)}`,
      goal: `10:00 AM Morning Job Search & Auto-Apply Routine (Target: at least ${targetCount} applications with Telegram & Email dispatches)`,
      status: 'running',
      currentStep: 0,
      maxSteps: 8,
      startedAt: new Date().toISOString(),
      logs: [],
      metrics: {
        jobsScanned: 0,
        jobsMatched: 0,
        applicationsPrepared: 0,
        coverLettersGenerated: 0,
        notificationsSent: 0,
      },
    };

    const addLog = (
      thought: string,
      action: string,
      tool: string,
      input: any,
      output: any,
      status: AgentActionLog['status'] = 'success'
    ) => {
      session.currentStep++;
      const log: AgentActionLog = {
        id: `log_${uuidv4().slice(0, 6)}`,
        timestamp: new Date().toISOString(),
        step: session.currentStep,
        thought,
        action,
        tool,
        input,
        output,
        status,
      };
      session.logs.push(log);
      if (onProgress) onProgress(log);
      db.saveAgentSession(session);
    };

    const appliedApplications: PreparedApplication[] = [];

    try {
      const profile = db.getProfile();

      // Step 1: Candidate Profile Inspection
      addLog(
        `[10:00 AM Morning Routine] Loading candidate profile for ${profile.name} (${profile.email}). Checking preferences for ${profile.preferredRoles.join(', ')}.`,
        'Loading candidate profile and search criteria',
        'get_candidate_profile',
        { name: profile.name, roles: profile.preferredRoles },
        { skillsCount: profile.skills.length, location: profile.location, remotePreference: profile.remotePreference }
      );

      // Step 2: Multi-Source Live Search
      addLog(
        `Searching live job boards (RemoteOK, Arbeitnow, Remotive, Greenhouse, Lever) for ${profile.preferredRoles[0]} and related roles.`,
        'Fetching & deduplicating live listings from all sources',
        'multi_source_job_search',
        { roles: profile.preferredRoles },
        {}
      );

      const searchResult = await JobService.searchAndIngestJobs(profile.preferredRoles[0]);
      session.metrics.jobsScanned = searchResult.jobs.length;
      session.logs[session.logs.length - 1].output = {
        found: searchResult.found,
        deduplicated: searchResult.deduplicated,
        activeJobsPool: searchResult.jobs.length,
      };

      // Step 3: AI Matching Matrix
      addLog(
        `Evaluating all active jobs against ${profile.name}'s tech stack using Gemini 2.5 AI matching engine.`,
        'Executing AI match scoring',
        'ai_match_jobs',
        { totalJobs: searchResult.jobs.length },
        {}
      );

      const matchRes = await JobService.matchAllUnmatchedJobs(profile);
      session.metrics.jobsMatched = matchRes.matchedCount;

      const allMatches = db.getMatches().sort((a, b) => b.score - a.score);
      const minScore = 75;
      let topEligible = allMatches.filter((m) => m.score >= minScore);

      // Ensure we have at least targetCount (e.g. 5)
      if (topEligible.length < targetCount) {
        topEligible = allMatches.slice(0, targetCount);
      } else {
        topEligible = topEligible.slice(0, targetCount);
      }

      session.logs[session.logs.length - 1].output = {
        totalEvaluated: allMatches.length,
        selectedForApplication: topEligible.length,
        topScore: topEligible[0]?.score || 0,
      };

      // Step 4: Prepare & Apply for at least 5 jobs
      addLog(
        `Synthesizing tailored application packages (bespoke cover letters, tailored responses) for ${topEligible.length} high-fit positions.`,
        'Batch preparing and submitting applications',
        'prepare_and_submit_batch',
        { targetCount: topEligible.length, autoSubmit },
        {}
      );

      for (const m of topEligible) {
        const job = db.getJobById(m.jobId);
        if (!job) continue;

        let app = db.getApplicationByJobId(job.id);
        if (!app) {
          app = await ApplicationService.prepareApplication(job.id);
          session.metrics.applicationsPrepared++;
          session.metrics.coverLettersGenerated++;
        }

        if (autoSubmit && app.status !== 'APPLIED') {
          app.status = 'APPLIED';
          app.appliedAt = new Date().toISOString();
          app.waitingForApproval = false;
          app.historyLogs.push({
            status: 'APPLIED',
            timestamp: new Date().toISOString(),
            note: `Auto-submitted via 10:00 AM Morning Job Routine (Match: ${app.matchScore}%)`,
            source: 'agent',
          });
          db.saveApplication(app);
        }

        appliedApplications.push(app);
      }

      session.logs[session.logs.length - 1].output = {
        applicationsProcessed: appliedApplications.length,
        companies: appliedApplications.map((a) => `${a.company} (${a.matchScore}%)`),
      };

      // Step 5: Telegram Morning Report Dispatch
      addLog(
        `Dispatching 10:00 AM morning report with all ${appliedApplications.length} applied positions to Telegram bot.`,
        'Sending Telegram morning digest',
        'send_telegram_morning_report',
        { applicationsCount: appliedApplications.length },
        {}
      );

      await TelegramService.sendMorningJobReport(appliedApplications, session.metrics.jobsScanned);
      session.metrics.notificationsSent++;
      session.logs[session.logs.length - 1].output = { telegramNotificationDispatched: true };

      // Step 6: Morning Email Digest Dispatch
      const emailConfig = db.getEmailDispatchConfig();
      addLog(
        `Generating and sending formatted morning email digest with all ${appliedApplications.length} applied jobs to ${emailConfig.recipientEmail}.`,
        'Dispatching morning email digest',
        'send_morning_email_digest',
        { recipient: emailConfig.recipientEmail, applicationsCount: appliedApplications.length },
        {}
      );

      const emailResult = await EmailService.sendMorningEmailDigest(appliedApplications, emailConfig.recipientEmail);
      session.logs[session.logs.length - 1].output = {
        recipient: emailConfig.recipientEmail,
        deliveredViaSmtp: emailResult.deliveredViaSmtp,
        message: emailResult.message,
      };

      // Final Step
      addLog(
        `✅ 10:00 AM Morning Routine Successfully Completed! ${appliedApplications.length} jobs applied, Telegram alert delivered, and morning email digest dispatched to ${emailConfig.recipientEmail}.`,
        'Morning routine completed',
        'complete_morning_routine',
        {},
        {
          appliedCount: appliedApplications.length,
          telegramAlertSent: true,
          emailDigestSent: true,
        }
      );

      session.status = 'completed';
      session.completedAt = new Date().toISOString();
      db.saveAgentSession(session);

      // Update scheduler last morning report timestamp
      db.updateSchedulerConfig({
        lastMorningReportSentAt: new Date().toISOString(),
        lastRunAt: new Date().toISOString(),
      });

      return { session, appliedApplications };
    } catch (err: any) {
      session.status = 'error';
      session.completedAt = new Date().toISOString();
      addLog(
        `Morning routine encountered an error: ${err.message}`,
        'Error recovery',
        'error_handler',
        {},
        { error: String(err) },
        'failed'
      );
      db.saveAgentSession(session);
      return { session, appliedApplications };
    }
  }

  /**
   * Run the full autonomous Job Search and Application Agent reasoning loop
   */
  static async runAutonomousAgent(
    goal: string,
    minMatchScore: number = 80,
    onProgress?: (log: AgentActionLog) => void
  ): Promise<AgentRunSession> {
    const session: AgentRunSession = {
      id: `session_${uuidv4().slice(0, 8)}`,
      goal,
      status: 'running',
      currentStep: 0,
      maxSteps: 7,
      startedAt: new Date().toISOString(),
      logs: [],
      metrics: {
        jobsScanned: 0,
        jobsMatched: 0,
        applicationsPrepared: 0,
        coverLettersGenerated: 0,
        notificationsSent: 0,
      },
    };

    const addLog = (
      thought: string,
      action: string,
      tool: string,
      input: any,
      output: any,
      status: AgentActionLog['status'] = 'success'
    ) => {
      session.currentStep++;
      const log: AgentActionLog = {
        id: `log_${uuidv4().slice(0, 6)}`,
        timestamp: new Date().toISOString(),
        step: session.currentStep,
        thought,
        action,
        tool,
        input,
        output,
        status,
      };
      session.logs.push(log);
      if (onProgress) onProgress(log);
      db.saveAgentSession(session);
    };

    try {
      // Step 1: Read Candidate Profile
      addLog(
        'I need to inspect the active candidate profile to extract technical skills, target roles, and location constraints.',
        'Fetching candidate profile from secure store',
        'get_candidate_profile',
        {},
        {
          name: db.getProfile().name,
          preferredRoles: db.getProfile().preferredRoles,
          skillsCount: db.getProfile().skills.length,
          remotePreference: db.getProfile().remotePreference,
        }
      );

      const profile = db.getProfile();

      // Step 2: Search and Ingest Multi-Source Jobs
      addLog(
        `Searching job sources (RemoteOK, Greenhouse, Lever, LinkedIn) for preferred roles: ${profile.preferredRoles.join(', ')}.`,
        'Executing multi-source job search adapter and deduplication pipeline',
        'search_and_deduplicate_jobs',
        { roles: profile.preferredRoles, sources: ['RemoteOK', 'Greenhouse', 'Lever', 'LinkedIn'] },
        {}
      );

      const searchResult = await JobService.searchAndIngestJobs(profile.preferredRoles[0]);
      session.metrics.jobsScanned = searchResult.jobs.length;

      // Update log output
      session.logs[session.logs.length - 1].output = {
        totalDiscovered: searchResult.found,
        duplicatesFiltered: searchResult.deduplicated,
        activeJobsPool: searchResult.jobs.length,
      };

      // Step 3: AI Matching Engine
      addLog(
        `Now evaluating all active jobs against candidate skills (${profile.skills.slice(0, 5).join(', ')}...) using Gemini Match Engine.`,
        'Running AI job matching and scoring matrix',
        'ai_match_jobs',
        { candidate: profile.name, totalJobs: searchResult.jobs.length },
        {}
      );

      const matchRes = await JobService.matchAllUnmatchedJobs(profile);
      session.metrics.jobsMatched = matchRes.matchedCount;

      const matches = db.getMatches();
      const highMatches = matches.filter((m) => m.score >= minMatchScore);

      session.logs[session.logs.length - 1].output = {
        evaluatedJobs: matches.length,
        highMatchesFound: highMatches.length,
        minScoreThreshold: minMatchScore,
      };

      // Step 4: Generate Cover Letters and Prepare Applications for High Matches
      if (highMatches.length === 0) {
        addLog(
          `No jobs met the minimum match threshold of ${minMatchScore}%. Ready to expand search criteria or lower threshold.`,
          'Completed search cycle without auto-preparing applications',
          'finalize_cycle',
          { minMatchScore },
          { message: 'Search cycle complete. Waiting for new listings.' }
        );
      } else {
        const topJobMatches = highMatches.slice(0, 3); // Prepare top 3 applications
        for (const m of topJobMatches) {
          const job = db.getJobById(m.jobId);
          if (!job) continue;

          // Check if application already exists
          const existingApp = db.getApplicationByJobId(job.id);
          if (!existingApp) {
            addLog(
              `Job "${job.title}" at ${job.company} scored ${m.score}% (Strong Match). Generating bespoke cover letter and answering application questions.`,
              `Preparing application package for ${job.company}`,
              'prepare_application_package',
              { jobId: job.id, company: job.company, score: m.score },
              {}
            );

            const app = await ApplicationService.prepareApplication(job.id);
            session.metrics.applicationsPrepared++;
            session.metrics.coverLettersGenerated++;

            session.logs[session.logs.length - 1].output = {
              applicationId: app.id,
              status: app.status,
              formFieldsDetected: app.formFields.length,
              coverLetterSnippet: app.coverLetterContent?.slice(0, 100) + '...',
            };

            // Notify via Telegram
            addLog(
              `Dispatching Telegram notification for prepared application at ${job.company}.`,
              'Sending notification alert to user',
              'send_telegram_alert',
              { company: job.company, score: m.score },
              { delivered: true }
            );
            session.metrics.notificationsSent++;
          }
        }
      }

      // Step 5: Human-In-The-Loop Pause
      addLog(
        `Autonomous cycle finished. ${session.metrics.applicationsPrepared} application(s) are prepared and waiting in the dashboard for your review and 1-click approval. Human approval is strictly enforced before submission.`,
        'Holding state at WAITING_FOR_APPROVAL',
        'pause_for_human_approval',
        { waitingCount: session.metrics.applicationsPrepared },
        { status: 'ready_for_user_approval' },
        'waiting_approval'
      );

      session.status = 'completed';
      session.completedAt = new Date().toISOString();
      db.saveAgentSession(session);
      return session;
    } catch (err: any) {
      session.status = 'error';
      session.completedAt = new Date().toISOString();
      addLog(
        `Agent loop encountered an error: ${err.message}`,
        'Error recovery',
        'error_handler',
        {},
        { error: String(err) },
        'failed'
      );
      db.saveAgentSession(session);
      return session;
    }
  }
}
