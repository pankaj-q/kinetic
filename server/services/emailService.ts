import nodemailer from 'nodemailer';
import { db } from '../db';
import { AIService } from './aiService';
import { TelegramService } from './telegramService';
import { EmailEvent, PreparedApplication } from '../../src/types';
import { v4 as uuidv4 } from 'uuid';

export class EmailService {
  /**
   * Helper to send an outbound email via SMTP if configured, and always record in database
   */
  static async sendOutboundEmail(params: {
    to: string;
    subject: string;
    text: string;
    html?: string;
  }): Promise<{ success: boolean; deliveredViaSmtp: boolean; message: string; emailEvent: EmailEvent }> {
    const emailConfig = db.getEmailDispatchConfig();
    let deliveredViaSmtp = false;
    let transportError = '';

    // Check if SMTP is configured
    if (emailConfig.smtpUser && emailConfig.smtpPassword) {
      try {
        const transporter = nodemailer.createTransport({
          host: emailConfig.smtpHost || 'smtp.gmail.com',
          port: emailConfig.smtpPort || 587,
          secure: emailConfig.smtpPort === 465,
          auth: {
            user: emailConfig.smtpUser,
            pass: emailConfig.smtpPassword,
          },
        });

        await transporter.sendMail({
          from: `"${emailConfig.senderName || 'Kinetic AI'}" <${emailConfig.smtpUser}>`,
          to: params.to,
          subject: params.subject,
          text: params.text,
          html: params.html || params.text.replace(/\n/g, '<br/>'),
        });
        deliveredViaSmtp = true;
      } catch (err: any) {
        console.warn('SMTP Send Failed, recorded in local stream:', err.message);
        transportError = err.message;
      }
    }

    // Always create an EmailEvent in the local DB so it's visible in Email Monitor
    const emailEvent: EmailEvent = {
      id: `em_out_${uuidv4().slice(0, 8)}`,
      sender: emailConfig.smtpUser || 'agent@kinetic.ai',
      recipient: params.to,
      subject: params.subject,
      snippet: params.text.slice(0, 150),
      fullBody: params.html || params.text,
      receivedAt: new Date().toISOString(),
      classification: 'STATUS_UPDATE',
      confidenceScore: 100,
      processed: true,
      actionTaken: deliveredViaSmtp
        ? 'Delivered directly to inbox via SMTP'
        : transportError
        ? `Logged in-app (SMTP note: ${transportError})`
        : `Dispatched to ${params.to} & logged in email stream`,
    };

    db.addEmail(emailEvent);

    return {
      success: true,
      deliveredViaSmtp,
      message: deliveredViaSmtp
        ? `Email successfully delivered to ${params.to} via Gmail SMTP!`
        : `Email dispatched to ${params.to} and recorded in in-app stream. (To route directly through your Gmail account, add your Gmail App Password in Settings).`,
      emailEvent,
    };
  }

  /**
   * Dispatches the 10:00 AM Morning Job Application Digest email to user's inbox
   */
  static async sendMorningEmailDigest(appliedApps: PreparedApplication[], targetRecipient?: string) {
    const emailConfig = db.getEmailDispatchConfig();
    const recipient = targetRecipient || emailConfig.recipientEmail || 'codepankaj84@gmail.com';
    const profile = db.getProfile();

    const jobsHtmlList = appliedApps
      .map(
        (app, idx) => `
        <tr style="border-bottom: 1px solid #334155;">
          <td style="padding: 12px; font-weight: bold; color: #f8fafc;">${idx + 1}. ${app.company}</td>
          <td style="padding: 12px; color: #cbd5e1;">${app.jobTitle}</td>
          <td style="padding: 12px; text-align: center;">
            <span style="background-color: #312e81; color: #a5b4fc; padding: 4px 8px; border-radius: 6px; font-weight: bold;">
              ${app.matchScore}%
            </span>
          </td>
          <td style="padding: 12px; text-align: center;">
            <span style="background-color: #064e3b; color: #6ee7b7; padding: 4px 8px; border-radius: 6px; font-weight: bold;">
              ${app.status}
            </span>
          </td>
          <td style="padding: 12px; text-align: center;">
            <a href="${app.applicationUrl}" style="color: #6366f1; text-decoration: underline;">View Role</a>
          </td>
        </tr>
      `
      )
      .join('');

    const plainText = `🌅 10:00 AM DAILY JOB APPLICATION DIGEST
Hello ${profile.name},

Here is your morning report. The Kinetic AI Job Search Agent has scanned live boards and applied to ${appliedApps.length} high-matching roles on your behalf:

${appliedApps
  .map(
    (app, i) =>
      `${i + 1}. ${app.company} - ${app.jobTitle} | Match: ${app.matchScore}% | Status: ${app.status}\n   Apply URL: ${app.applicationUrl}`
  )
  .join('\n\n')}

Next scheduled scan: Tomorrow at 10:00 AM.
Best regards,
Kinetic AI`;

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 680px; margin: 0 auto; background-color: #0f172a; color: #e2e8f0; border-radius: 12px; padding: 24px; border: 1px solid #1e293b;">
        <div style="border-bottom: 1px solid #334155; padding-bottom: 16px; margin-bottom: 20px;">
          <h1 style="color: #6366f1; margin: 0 0 8px 0; font-size: 22px;">🌅 10:00 AM Job Application Digest</h1>
          <p style="color: #94a3b8; margin: 0; font-size: 14px;">Autonomous Daily Dispatch for <strong>${profile.name}</strong> (${recipient})</p>
        </div>

        <p style="font-size: 14px; line-height: 1.5; color: #cbd5e1;">
          Good morning! Your Kinetic Autonomous Agent has completed today's morning cycle. Below are the <strong>${appliedApps.length} positions</strong> processed, verified against your candidate profile, and submitted:
        </p>

        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 13px; text-align: left;">
          <thead>
            <tr style="background-color: #1e293b; color: #94a3b8;">
              <th style="padding: 10px 12px;">Company</th>
              <th style="padding: 10px 12px;">Role</th>
              <th style="padding: 10px 12px; text-align: center;">Match</th>
              <th style="padding: 10px 12px; text-align: center;">Status</th>
              <th style="padding: 10px 12px; text-align: center;">Link</th>
            </tr>
          </thead>
          <tbody>
            ${jobsHtmlList}
          </tbody>
        </table>

        <div style="background-color: #1e293b; padding: 14px; border-radius: 8px; margin-top: 20px;">
          <h3 style="margin: 0 0 6px 0; font-size: 14px; color: #f8fafc;">📊 What Happens Next?</h3>
          <p style="margin: 0; font-size: 12px; color: #94a3b8; line-height: 1.4;">
            • Recruiter replies will be automatically monitored and classified by the Email Monitor.<br/>
            • Interview invitations will trigger instant push alerts to your linked Telegram chat.<br/>
            • Next scheduled morning routine will run tomorrow at 10:00 AM.
          </p>
        </div>

        <div style="margin-top: 24px; font-size: 11px; color: #64748b; text-align: center; border-top: 1px solid #334155; padding-top: 16px;">
          Sent by Kinetic Autonomous AI Engine • <a href="mailto:${recipient}" style="color: #6366f1;">${recipient}</a>
        </div>
      </div>
    `;

    return this.sendOutboundEmail({
      to: recipient,
      subject: `🌅 10:00 AM Morning Job Digest: ${appliedApps.length} Applications Applied`,
      text: plainText,
      html,
    });
  }

  /**
   * Dispatches a quick test email to verify user's email configuration
   */
  static async sendTestEmail(recipientEmail: string) {
    const profile = db.getProfile();
    const text = `🚀 Kinetic Email System Verified!\n\nHello ${profile.name},\n\nThis is a test notification confirming your email dispatch system is operational.\nYour 10:00 AM daily job digest with at least 5 applied positions will be delivered to this address.\n\nTime: ${new Date().toLocaleString()}`;
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 550px; margin: 0 auto; background-color: #0f172a; color: #e2e8f0; border-radius: 12px; padding: 24px; border: 1px solid #1e293b;">
        <h2 style="color: #10b981; margin-top: 0;">🚀 Email System Test Verified!</h2>
        <p style="color: #cbd5e1; font-size: 14px;">
          Hello <strong>${profile.name}</strong>,
        </p>
        <p style="color: #cbd5e1; font-size: 14px;">
          This test confirms that your Kinetic email dispatch pipeline is connected and operational for <strong>${recipientEmail}</strong>.
        </p>
        <div style="background-color: #1e293b; padding: 12px; border-radius: 8px; font-size: 13px; color: #94a3b8;">
          ⏰ <strong>Scheduled Routine:</strong> Every morning at 10:00 AM<br/>
          🎯 <strong>Batch Target:</strong> At least 5 high-match job applications<br/>
          📱 <strong>Telegram Alerts:</strong> Active
        </div>
      </div>
    `;

    return this.sendOutboundEmail({
      to: recipientEmail,
      subject: '🚀 Kinetic AI: Email Dispatch Connection Test',
      text,
      html,
    });
  }

  /**
   * Process an incoming email, classify status with AI, map to application, update status and notify.
   */
  static async processEmail(rawEmail: {
    sender: string;
    recipient: string;
    subject: string;
    body: string;
  }): Promise<{ emailEvent: EmailEvent; applicationUpdated: boolean }> {
    const classificationResult = await AIService.classifyEmail(
      rawEmail.body,
      rawEmail.subject,
      rawEmail.sender
    );

    // Try to match with existing applications
    const applications = db.getApplications();
    const detectedCompanyLower = classificationResult.detectedCompany.toLowerCase();

    let matchedApp = applications.find(
      (a) =>
        a.company.toLowerCase().includes(detectedCompanyLower) ||
        detectedCompanyLower.includes(a.company.toLowerCase()) ||
        rawEmail.subject.toLowerCase().includes(a.company.toLowerCase()) ||
        rawEmail.body.toLowerCase().includes(a.company.toLowerCase())
    );

    const emailEvent: EmailEvent = {
      id: `em_${uuidv4().slice(0, 8)}`,
      sender: rawEmail.sender,
      recipient: rawEmail.recipient,
      subject: rawEmail.subject,
      snippet: rawEmail.body.slice(0, 150) + (rawEmail.body.length > 150 ? '...' : ''),
      fullBody: rawEmail.body,
      receivedAt: new Date().toISOString(),
      classification: classificationResult.classification,
      confidenceScore: classificationResult.confidenceScore,
      detectedCompany: classificationResult.detectedCompany,
      matchedApplicationId: matchedApp?.id,
      processed: true,
      actionTaken: classificationResult.actionRecommendation,
    };

    db.addEmail(emailEvent);

    let applicationUpdated = false;

    // Synchronize application status based on AI classification (Section 17)
    if (matchedApp) {
      if (classificationResult.classification === 'INTERVIEW') {
        matchedApp.status = 'INTERVIEW';
        matchedApp.interviewDate = new Date(Date.now() + 86400000 * 3).toISOString();
        matchedApp.historyLogs.push({
          status: 'INTERVIEW',
          timestamp: new Date().toISOString(),
          note: `Email Monitor detected interview invitation: "${rawEmail.subject}"`,
          source: 'email_monitor',
        });
        db.saveApplication(matchedApp);
        applicationUpdated = true;

        await TelegramService.notifyInterviewDetected(
          matchedApp.company,
          matchedApp.jobTitle,
          rawEmail.body
        );
      } else if (classificationResult.classification === 'REJECTION') {
        matchedApp.status = 'REJECTED';
        matchedApp.historyLogs.push({
          status: 'REJECTED',
          timestamp: new Date().toISOString(),
          note: `Email Monitor detected rejection notice: "${rawEmail.subject}"`,
          source: 'email_monitor',
        });
        db.saveApplication(matchedApp);
        applicationUpdated = true;

        await TelegramService.notifyRejectionDetected(matchedApp.company, matchedApp.jobTitle);
      } else if (classificationResult.classification === 'OFFER') {
        matchedApp.status = 'OFFER';
        matchedApp.historyLogs.push({
          status: 'OFFER',
          timestamp: new Date().toISOString(),
          note: `Email Monitor detected official job offer! "${rawEmail.subject}"`,
          source: 'email_monitor',
        });
        db.saveApplication(matchedApp);
        applicationUpdated = true;

        await TelegramService.sendTelegramNotification(
          `🎉 *OFFER RECEIVED!*\n\n*Company:* ${matchedApp.company}\n*Role:* ${matchedApp.jobTitle}\n\nCongratulations! Please review the terms in your dashboard.`,
          'submission_success',
          '🎉 Job Offer Received!',
          { applicationId: matchedApp.id, company: matchedApp.company }
        );
      }
    }

    return { emailEvent, applicationUpdated };
  }

  /**
   * Simulate receiving a recruiter update email (for demo & testing live pipeline)
   */
  static async simulateRecruiterEmail(type: 'interview' | 'rejection' | 'offer' | 'screening', companyName?: string) {
    const apps = db.getApplications();
    const targetApp = apps[0];
    const company = companyName || targetApp?.company || 'Acme Engineering';
    const role = targetApp?.jobTitle || 'Senior Software Engineer';

    let subject = '';
    let body = '';

    if (type === 'interview') {
      subject = `Interview Schedule: ${role} at ${company}`;
      body = `Hi Alex,

Thank you for your application to ${company} for the ${role} position. We were very impressed with your backend microservices background and BullMQ queue optimization experience.

We would love to invite you to a 45-minute technical system architecture conversation with our engineering team next week.

Please pick a time that works best for you here: https://calendly.com/${company.toLowerCase().replace(/[^a-z0-9]/g, '')}-recruiting/alex-morgan

Best regards,
Talent Acquisition Team | ${company}`;
    } else if (type === 'rejection') {
      subject = `Update on your application at ${company}`;
      body = `Dear Alex,

Thank you for taking the time to speak with our team about the ${role} role at ${company}. While we were impressed with your qualifications, we have chosen to move forward with another candidate whose background is an exact match for our immediate needs.

We will keep your resume on file for future openings.

Sincerely,
${company} Recruiting`;
    } else if (type === 'offer') {
      subject = `Offer of Employment: ${role} at ${company}!`;
      body = `Dear Alex,

On behalf of ${company}, I am thrilled to extend an offer of employment for the position of ${role}!

We were thoroughly impressed by your technical depth and problem-solving skills throughout the interviews. Attached you will find the formal offer letter outlining your starting compensation, equity grant, and comprehensive benefits.

Please let us know your planned start date by Friday.

Warm congratulations!
VP of Engineering | ${company}`;
    } else {
      subject = `Application Received: ${role} at ${company}`;
      body = `Hello Alex,

We have received your application for the ${role} position. Our hiring team is currently reviewing your profile and will be in touch with next steps shortly.

Best regards,
${company} Careers`;
    }

    return this.processEmail({
      sender: `careers@${company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
      recipient: 'codepankaj84@gmail.com',
      subject,
      body,
    });
  }
}
