import { db } from '../db';
import { Job, PreparedApplication, NotificationMessage } from '../../src/types';
import { v4 as uuidv4 } from 'uuid';

export class TelegramService {
  /**
   * Send notification via real Telegram Bot API if configured, plus store in in-app notification feed.
   */
  static async sendTelegramNotification(
    text: string,
    type: NotificationMessage['type'],
    title: string,
    meta?: NotificationMessage['data']
  ): Promise<{ success: boolean; deliveredToTelegram: boolean; notification: NotificationMessage }> {
    const config = db.getTelegramConfig();

    // 1. Store in-app notification
    const notification: NotificationMessage = {
      id: `notif_${uuidv4().slice(0, 8)}`,
      type,
      title,
      body: text,
      timestamp: new Date().toISOString(),
      read: false,
      data: meta,
    };
    db.addNotification(notification);

    // 2. Deliver to Telegram if configured
    let deliveredToTelegram = false;
    if (config.enabled && config.botToken && config.chatId) {
      try {
        const url = `https://api.telegram.org/bot${config.botToken}/sendMessage`;
        const payload = {
          chat_id: config.chatId,
          text: `🤖 *Kinetic Notification*\n\n${text}`,
          parse_mode: 'Markdown',
        };

        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          deliveredToTelegram = true;
        } else {
          console.warn('Telegram API delivery response not OK:', await response.text());
        }
      } catch (err) {
        console.warn('Failed to send Telegram message:', err);
      }
    }

    return {
      success: true,
      deliveredToTelegram,
      notification,
    };
  }

  /**
   * Event Formatters matching Section 16 of the Plan
   */

  static async notifyHighMatchJob(job: Job, matchScore: number, matchingSkills: string[]) {
    const title = `🔥 New Job Match (${matchScore}%)`;
    const text = `*${title}*

*Role:* ${job.title}
*Company:* ${job.company}
*Location:* ${job.location}
*Match Score:* ${matchScore}%

*Key Matching Skills:*
${matchingSkills.map((s) => `✓ ${s}`).join('\n')}

[Review in Kinetic Dashboard]`;

    return this.sendTelegramNotification(text, 'high_match', title, {
      jobId: job.id,
      score: matchScore,
      company: job.company,
      url: job.url,
    });
  }

  static async notifyApplicationPrepared(app: PreparedApplication) {
    const title = `📝 Application Prepared (Awaiting Approval)`;
    const text = `*${title}*

*Company:* ${app.company}
*Role:* ${app.jobTitle}
*Match:* ${app.matchScore}%

*Status:* Waiting for Human Approval
*Cover Letter:* Tailored & Attached
*Custom Questions:* Auto-Answered with Evidence

👉 Please review and approve before final submission.`;

    return this.sendTelegramNotification(text, 'application_prepared', title, {
      applicationId: app.id,
      company: app.company,
    });
  }

  static async notifyApplicationSubmitted(app: PreparedApplication) {
    const title = `✅ Application Submitted`;
    const text = `*${title}*

*Company:* ${app.company}
*Role:* ${app.jobTitle}

*Status:* APPLIED
*Timestamp:* ${new Date().toLocaleTimeString()}`;

    return this.sendTelegramNotification(text, 'submission_success', title, {
      applicationId: app.id,
      company: app.company,
    });
  }

  static async notifyInterviewDetected(company: string, role: string, snippet: string) {
    const title = `🎉 Interview Update Detected!`;
    const text = `*${title}*

*Company:* ${company}
*Role:* ${role}

*Interview Notice:*
"${snippet.slice(0, 140)}..."

Please check your dashboard to schedule your conversation!`;

    return this.sendTelegramNotification(text, 'interview_detected', title, {
      company,
    });
  }

  static async notifyRejectionDetected(company: string, role: string) {
    const title = `Application Update: ${company}`;
    const text = `*Application Update*

*Company:* ${company}
*Role:* ${role}
*Status:* REJECTED

Your pipeline has been synchronized.`;

    return this.sendTelegramNotification(text, 'rejection_detected', title, {
      company,
    });
  }

  /**
   * Dispatches the 10:00 AM Morning Job Search & Application Digest with at least 5 jobs applied
   */
  static async sendMorningJobReport(appliedApps: PreparedApplication[], totalJobsScanned: number) {
    const emailConfig = db.getEmailDispatchConfig();
    const title = `🌅 10:00 AM Morning Job Search & Application Digest`;
    
    let jobsListText = '';
    if (appliedApps.length === 0) {
      jobsListText = 'No eligible jobs met the threshold this morning. Agent will rescan on the next cycle.';
    } else {
      jobsListText = appliedApps
        .map(
          (app, i) =>
            `*${i + 1}. ${app.company}* — ${app.jobTitle}\n   ⭐ *Match Score:* ${app.matchScore}%\n   📍 *Status:* ${app.status}\n   🔗 [Apply Link](${app.applicationUrl})`
        )
        .join('\n\n');
    }

    const text = `🌅 *10:00 AM MORNING JOB REPORT* 🚀

🎯 *${appliedApps.length} Job Applications Processed & Submitted:*

${jobsListText}

━━━━━━━━━━━━━━━━━━━━
📊 *Total Listings Scanned:* ${totalJobsScanned}
📧 *Morning Email Digest:* Sent to \`${emailConfig.recipientEmail}\`
⏰ *Next Daily Routine:* Tomorrow at 10:00 AM`;

    return this.sendTelegramNotification(text, 'submission_success', title, {
      count: appliedApps.length,
    });
  }
}
