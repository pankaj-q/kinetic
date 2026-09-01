import { db } from '../db';
import { AgentLoop } from './agentLoop';
import { EmailService } from './emailService';

export class SchedulerService {
  private static timer: NodeJS.Timeout | null = null;
  private static minuteChecker: NodeJS.Timeout | null = null;
  private static isRunning = false;

  /**
   * Start or restart background scheduler and 10:00 AM daily monitor
   */
  static startScheduler() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.minuteChecker) {
      clearInterval(this.minuteChecker);
      this.minuteChecker = null;
    }

    const config = db.getSchedulerConfig();
    if (!config.active) {
      console.log('Background scheduler is currently disabled.');
      return;
    }

    const intervalMs = Math.max(1, config.intervalMinutes || 180) * 60 * 1000;
    console.log(`Starting JobAgent scheduler (Interval: ${config.intervalMinutes}m, Daily Morning Target: ${config.dailyMorningTime || '10:00'} AM).`);

    // Standard interval runner
    this.timer = setInterval(async () => {
      await this.runScheduledCycle();
    }, intervalMs);

    // Minute check for exact 10:00 AM morning routine
    this.minuteChecker = setInterval(async () => {
      await this.checkDailyMorningSchedule();
    }, 45 * 1000);
  }

  /**
   * Checks if current clock matches the 10:00 AM daily morning schedule
   */
  private static async checkDailyMorningSchedule() {
    const config = db.getSchedulerConfig();
    if (!config.active) return;

    const targetTime = config.dailyMorningTime || '10:00'; // e.g. "10:00"
    const now = new Date();
    const currentHours = String(now.getHours()).padStart(2, '0');
    const currentMins = String(now.getMinutes()).padStart(2, '0');
    const currentTimeStr = `${currentHours}:${currentMins}`;

    // Check if within the scheduled minute
    if (currentTimeStr === targetTime) {
      const todayDateStr = now.toISOString().slice(0, 10);
      const lastSentDateStr = config.lastMorningReportSentAt ? config.lastMorningReportSentAt.slice(0, 10) : '';

      // Only run once per day
      if (todayDateStr !== lastSentDateStr && !this.isRunning) {
        console.log(`🌅 [SCHEDULER] 10:00 AM Morning trigger matched! Executing morning routine with >= 5 applications...`);
        await this.runMorningRoutineNow(config.minJobsToApplyDaily || 5, config.autoSubmitOnMorning !== false);
      }
    }
  }

  /**
   * Trigger the 10:00 AM Morning Routine immediately (useful for UI test button or scheduled run)
   */
  static async runMorningRoutineNow(targetCount: number = 5, autoSubmit: boolean = true) {
    if (this.isRunning) {
      return { status: 'already_running', message: 'Agent pipeline is already actively executing a cycle.' };
    }

    this.isRunning = true;
    try {
      console.log(`🚀 [SCHEDULER] Triggering 10:00 AM Morning Routine (Target: ${targetCount} applications)...`);
      const result = await AgentLoop.runMorningRoutine(targetCount, autoSubmit);
      return {
        status: 'success',
        message: `Morning routine completed successfully. ${result.appliedApplications.length} jobs applied, Telegram alert sent, and email digest dispatched.`,
        session: result.session,
        appliedCount: result.appliedApplications.length,
      };
    } catch (err: any) {
      console.error('Error during morning routine execution:', err);
      return {
        status: 'failed',
        message: err.message || 'Failed to execute morning routine.',
      };
    } finally {
      this.isRunning = false;
    }
  }

  /**
   * Execute standard scheduled workflow (Job search, matching, preparing applications, email sync)
   */
  static async runScheduledCycle(): Promise<{ status: string; timestamp: string }> {
    if (this.isRunning) {
      return { status: 'already_running', timestamp: new Date().toISOString() };
    }

    this.isRunning = true;
    const config = db.getSchedulerConfig();
    console.log('--- [SCHEDULER] Triggering Automated JobAgent Pipeline Cycle ---');

    try {
      config.lastRunAt = new Date().toISOString();
      config.nextRunAt = new Date(Date.now() + (config.intervalMinutes || 180) * 60 * 1000).toISOString();
      db.updateSchedulerConfig(config);

      // 1. Run autonomous agent loop
      await AgentLoop.runAutonomousAgent(
        'Scheduled automated job scan and application preparation',
        config.minMatchScoreForAutoPrepare
      );

      return {
        status: 'success',
        timestamp: new Date().toISOString(),
      };
    } catch (err) {
      console.error('Error during scheduled pipeline run:', err);
      return {
        status: 'failed',
        timestamp: new Date().toISOString(),
      };
    } finally {
      this.isRunning = false;
    }
  }

  static stopScheduler() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.minuteChecker) {
      clearInterval(this.minuteChecker);
      this.minuteChecker = null;
    }
  }
}
