import React, { useState } from 'react';
import {
  Sliders,
  Send,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Shield,
  Bot,
  Play,
  Save,
  Mail,
  Sun,
  Zap,
  Info,
  ExternalLink
} from 'lucide-react';
import { TelegramConfig, SchedulerConfig, EmailDispatchConfig } from '../types';

interface SettingsViewProps {
  telegramConfig: TelegramConfig;
  schedulerConfig: SchedulerConfig;
  emailConfig?: EmailDispatchConfig;
  onSaveTelegram: (config: TelegramConfig) => Promise<void>;
  onTestTelegram: () => Promise<void>;
  onSaveScheduler: (config: SchedulerConfig) => Promise<void>;
  onTriggerSchedulerNow: () => Promise<void>;
  onRunMorningRoutineNow?: (targetCount?: number, autoSubmit?: boolean) => Promise<any>;
  onSaveEmailConfig?: (config: EmailDispatchConfig) => Promise<void>;
  onTestEmail?: (email?: string) => Promise<void>;
  onResetDemo: () => Promise<void>;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  telegramConfig,
  schedulerConfig,
  emailConfig,
  onSaveTelegram,
  onTestTelegram,
  onSaveScheduler,
  onTriggerSchedulerNow,
  onRunMorningRoutineNow,
  onSaveEmailConfig,
  onTestEmail,
  onResetDemo,
}) => {
  const [tg, setTg] = useState<TelegramConfig>(telegramConfig);
  const [sched, setSched] = useState<SchedulerConfig>(schedulerConfig);
  const [emailConf, setEmailConf] = useState<EmailDispatchConfig>(
    emailConfig || {
      enabled: true,
      recipientEmail: 'codepankaj84@gmail.com',
      senderName: 'JobAgent Autonomous AI',
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      smtpUser: '',
      smtpPassword: '',
      useTls: true,
      sendDailyMorningDigest: true,
    }
  );

  const [isSavingTg, setIsSavingTg] = useState(false);
  const [isTestingTg, setIsTestingTg] = useState(false);
  const [tgTestSuccess, setTgTestSuccess] = useState(false);

  const [isSavingSched, setIsSavingSched] = useState(false);
  const [isTriggeringSched, setIsTriggeringSched] = useState(false);
  const [schedTriggerSuccess, setSchedTriggerSuccess] = useState(false);

  const [isRunningMorning, setIsRunningMorning] = useState(false);
  const [morningResult, setMorningResult] = useState<string | null>(null);

  const [isSavingEmail, setIsSavingEmail] = useState(false);
  const [isTestingEmail, setIsTestingEmail] = useState(false);
  const [emailTestSuccess, setEmailTestSuccess] = useState<string | null>(null);

  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);

  const handleSaveTelegram = async () => {
    setIsSavingTg(true);
    try {
      await onSaveTelegram(tg);
    } finally {
      setIsSavingTg(false);
    }
  };

  const handleTestTelegram = async () => {
    setIsTestingTg(true);
    try {
      await onTestTelegram();
      setTgTestSuccess(true);
      setTimeout(() => setTgTestSuccess(false), 4000);
    } finally {
      setIsTestingTg(false);
    }
  };

  const handleSaveScheduler = async () => {
    setIsSavingSched(true);
    try {
      await onSaveScheduler(sched);
    } finally {
      setIsSavingSched(false);
    }
  };

  const handleTriggerScheduler = async () => {
    setIsTriggeringSched(true);
    try {
      await onTriggerSchedulerNow();
      setSchedTriggerSuccess(true);
      setTimeout(() => setSchedTriggerSuccess(false), 4000);
    } finally {
      setIsTriggeringSched(false);
    }
  };

  const handleRunMorningTest = async () => {
    if (!onRunMorningRoutineNow) return;
    setIsRunningMorning(true);
    setMorningResult(null);
    try {
      const res = await onRunMorningRoutineNow(sched.minJobsToApplyDaily || 5, sched.autoSubmitOnMorning !== false);
      setMorningResult(
        res?.message ||
          `Success! Applied to ${res?.appliedCount || 5} jobs, sent Telegram alert, and dispatched email digest to ${emailConf.recipientEmail}.`
      );
    } catch (err: any) {
      setMorningResult(`Error running morning routine: ${err.message}`);
    } finally {
      setIsRunningMorning(false);
    }
  };

  const handleSaveEmail = async () => {
    if (!onSaveEmailConfig) return;
    setIsSavingEmail(true);
    try {
      await onSaveEmailConfig(emailConf);
    } finally {
      setIsSavingEmail(false);
    }
  };

  const handleTestEmailClick = async () => {
    if (!onTestEmail) return;
    setIsTestingEmail(true);
    setEmailTestSuccess(null);
    try {
      await onTestEmail(emailConf.recipientEmail);
      setEmailTestSuccess(`Test verification email successfully dispatched to ${emailConf.recipientEmail}!`);
      setTimeout(() => setEmailTestSuccess(null), 5000);
    } catch (err: any) {
      setEmailTestSuccess(`Failed to dispatch test email: ${err.message}`);
    } finally {
      setIsTestingEmail(false);
    }
  };

  const handleReset = async () => {
    if (window.confirm('Reset all jobs, matches, applications, and logs back to the curated demo baseline?')) {
      setIsResetting(true);
      try {
        await onResetDemo();
        setResetSuccess(true);
        setTimeout(() => setResetSuccess(false), 4000);
      } finally {
        setIsResetting(false);
      }
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 font-['Geist',sans-serif]">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center border border-blue-200">
            <Sliders className="w-4 h-4 text-[#2563EB]" />
          </div>
          <h1 className="text-2xl font-normal font-editorial text-[#0F172A] tracking-tight">
            Automation, Telegram & Email Settings
          </h1>
        </div>
        <p className="text-xs text-[#64748B] mt-1 font-sans">
          Configure autonomous 10:00 AM daily job applications, real-time Telegram alerts, and Gmail email dispatches.
        </p>
      </div>

      {/* Featured 10:00 AM Morning Job Routine Quick Banner */}
      <div className="p-6 rounded-2xl bg-amber-50/60 border border-amber-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xs">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 border border-amber-300">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-[#0F172A] tracking-tight font-['Geist',sans-serif]">Daily 10:00 AM Autonomous Pipeline</h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300 font-['Geist_Mono',monospace]">
                SCHEDULED
              </span>
            </div>
            <p className="text-xs text-[#475569] mt-1 max-w-xl leading-relaxed font-sans">
              Every morning at <strong className="text-[#0F172A] font-['Geist_Mono',monospace]">10:00 AM</strong>, the agent scans live boards, scores matches, prepares & applies to at least <strong className="text-[#0F172A]">5 target jobs</strong>, sends a full summary on <strong className="text-[#0F172A]">Telegram</strong>, and delivers an email digest to <strong className="text-[#2563EB] font-['Geist_Mono',monospace]">{emailConf.recipientEmail}</strong>.
            </p>
          </div>
        </div>

        <button
          id="run-morning-test-now-btn"
          onClick={handleRunMorningTest}
          disabled={isRunningMorning}
          className="huvo-amber-glow-button flex items-center gap-2 px-5 py-2.5 rounded-xl text-slate-950 font-bold text-xs shadow-xs transition-all active:scale-95 disabled:opacity-50 shrink-0 font-['Geist',sans-serif]"
        >
          <Zap className={`w-4 h-4 ${isRunningMorning ? 'animate-spin' : ''}`} />
          <span>{isRunningMorning ? 'Running 10:00 AM Routine...' : '⚡ Test 10:00 AM Routine (5 Applied)'}</span>
        </button>
      </div>

      {morningResult && (
        <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 font-semibold flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{morningResult}</span>
        </div>
      )}

      {/* 2-Column Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scheduler & 10:00 AM Daily Routine Card */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white space-y-5 border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center border border-blue-200">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#0F172A] tracking-tight font-['Geist',sans-serif]">Daily Schedule & Automation Rules</h2>
                <p className="text-xs text-[#64748B]">Autonomous morning execution triggers</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={sched.active}
                onChange={(e) => setSched({ ...sched, active: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2563EB]"></div>
            </label>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-[#0F172A] block mb-1.5 uppercase tracking-wider font-['Geist',sans-serif]">
                  Morning Trigger Time
                </label>
                <input
                  type="text"
                  placeholder="10:00"
                  value={sched.dailyMorningTime || '10:00'}
                  onChange={(e) => setSched({ ...sched, dailyMorningTime: e.target.value })}
                  className="w-full text-xs text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 font-['Geist_Mono',monospace]"
                />
                <p className="text-[10px] text-[#64748B] mt-1 font-['Geist_Mono',monospace]">24-hour format (e.g. 10:00 = 10:00 AM)</p>
              </div>

              <div>
                <label className="text-xs font-bold text-[#0F172A] block mb-1.5 uppercase tracking-wider font-['Geist',sans-serif]">
                  Daily Min Jobs to Apply
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={sched.minJobsToApplyDaily || 5}
                  onChange={(e) => setSched({ ...sched, minJobsToApplyDaily: Number(e.target.value) })}
                  className="w-full text-xs text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 font-['Geist_Mono',monospace]"
                />
                <p className="text-[10px] text-[#64748B] mt-1 font-['Geist_Mono',monospace]">Target ≥ 5 applications per morning</p>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-[#0F172A] block mb-1.5 uppercase tracking-wider font-['Geist',sans-serif]">
                Auto-Prepare Minimum Match Score: <span className="font-['Geist_Mono',monospace] text-[#2563EB]">{sched.minMatchScoreForAutoPrepare}%</span>
              </label>
              <input
                type="range"
                min={60}
                max={95}
                step={5}
                value={sched.minMatchScoreForAutoPrepare}
                onChange={(e) =>
                  setSched({ ...sched, minMatchScoreForAutoPrepare: Number(e.target.value) })
                }
                className="w-full accent-[#2563EB]"
              />
              <p className="text-[11px] text-[#64748B] mt-1">
                Jobs with match scores at or above this threshold will automatically have tailored cover letters and applications synthesized.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-1.5 text-xs text-[#64748B] font-['Geist_Mono',monospace]">
              <div className="flex justify-between">
                <span>Morning Routine:</span>
                <span className="text-amber-700 font-bold">Every Day @ {sched.dailyMorningTime || '10:00'} AM</span>
              </div>
              <div className="flex justify-between">
                <span>Last Run:</span>
                <span className="text-[#0F172A]">
                  {sched.lastRunAt ? new Date(sched.lastRunAt).toLocaleTimeString() : 'Pending'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Next Scheduled Run:</span>
                <span className="text-[#0F172A]">
                  {sched.nextRunAt ? new Date(sched.nextRunAt).toLocaleTimeString() : 'Tomorrow 10:00 AM'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
            <button
              onClick={handleTriggerScheduler}
              disabled={isTriggeringSched}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#334155] text-xs font-semibold border border-[#E2E8F0] transition-all disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>{isTriggeringSched ? 'Triggering...' : 'Trigger Cycle Now'}</span>
            </button>

            <button
              id="save-scheduler-settings-btn"
              onClick={handleSaveScheduler}
              disabled={isSavingSched}
              className="huvo-glow-button flex items-center gap-1.5 px-4.5 py-2 rounded-lg text-white text-xs font-bold transition-all font-['Geist',sans-serif]"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSavingSched ? 'Saving...' : 'Save Schedule Settings'}</span>
            </button>
          </div>

          {schedTriggerSuccess && (
            <p className="text-xs text-[#10B981] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Scheduled cycle triggered successfully!
            </p>
          )}
        </div>

        {/* Telegram Bot Integration Card */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white space-y-5 border border-[#E2E8F0] shadow-xs">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-[#2563EB] flex items-center justify-center border border-blue-200">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#0F172A] tracking-tight font-['Geist',sans-serif]">Telegram Real-Time Alerts</h2>
                <p className="text-xs text-[#64748B]">Pushes 10:00 AM report & recruiter updates</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={tg.enabled}
                onChange={(e) => setTg({ ...tg, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2563EB]"></div>
            </label>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="text-xs font-bold text-[#0F172A] block mb-1.5 uppercase tracking-wider font-['Geist',sans-serif]">Telegram Bot Token</label>
              <input
                type="text"
                placeholder="e.g. 7123456789:AAFx9_exampleBotToken"
                value={tg.botToken}
                onChange={(e) => setTg({ ...tg, botToken: e.target.value })}
                className="w-full text-xs text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 font-['Geist_Mono',monospace]"
              />
              <p className="text-[11px] text-[#64748B] mt-1 font-sans">Create with @BotFather on Telegram</p>
            </div>

            <div>
              <label className="text-xs font-bold text-[#0F172A] block mb-1.5 uppercase tracking-wider font-['Geist',sans-serif]">Telegram Chat ID</label>
              <input
                type="text"
                placeholder="e.g. 987654321"
                value={tg.chatId}
                onChange={(e) => setTg({ ...tg, chatId: e.target.value })}
                className="w-full text-xs text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 font-['Geist_Mono',monospace]"
              />
              <p className="text-[11px] text-[#64748B] mt-1 font-sans">Get your ID from @userinfobot or @myidbot</p>
            </div>

            {/* Notification Checkboxes */}
            <div className="space-y-2.5 pt-2.5 border-t border-[#E2E8F0]">
              <span className="text-xs font-bold text-[#0F172A] block uppercase tracking-wider font-['Geist',sans-serif]">Notification Events</span>

              <label className="flex items-center gap-2.5 text-xs text-[#334155] cursor-pointer">
                <input
                  type="checkbox"
                  checked={tg.morningReportEnabled !== false}
                  onChange={(e) => setTg({ ...tg, morningReportEnabled: e.target.checked })}
                  className="rounded text-[#2563EB] bg-white border-slate-300"
                />
                <span className="font-semibold text-amber-800">10:00 AM Morning Job Report (5+ applied jobs)</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-[#334155] cursor-pointer">
                <input
                  type="checkbox"
                  checked={tg.notifyOnHighMatch}
                  onChange={(e) => setTg({ ...tg, notifyOnHighMatch: e.target.checked })}
                  className="rounded text-[#2563EB] bg-white border-slate-300"
                />
                <span>High Match Job Discovered (&gt;80%)</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-[#334155] cursor-pointer">
                <input
                  type="checkbox"
                  checked={tg.notifyOnSubmission}
                  onChange={(e) => setTg({ ...tg, notifyOnSubmission: e.target.checked })}
                  className="rounded text-[#2563EB] bg-white border-slate-300"
                />
                <span>Application Submission Confirmation</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-[#334155] cursor-pointer">
                <input
                  type="checkbox"
                  checked={tg.notifyOnInterview}
                  onChange={(e) => setTg({ ...tg, notifyOnInterview: e.target.checked })}
                  className="rounded text-[#2563EB] bg-white border-slate-300"
                />
                <span>Recruiter Interview & Offer Invitations</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
            <button
              onClick={handleTestTelegram}
              disabled={isTestingTg}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#334155] text-xs font-semibold border border-[#E2E8F0] transition-all disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>{isTestingTg ? 'Sending...' : 'Send Test Alert'}</span>
            </button>

            <button
              id="save-telegram-settings-btn"
              onClick={handleSaveTelegram}
              disabled={isSavingTg}
              className="huvo-glow-button flex items-center gap-1.5 px-4.5 py-2 rounded-lg text-white text-xs font-bold transition-all font-['Geist',sans-serif]"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSavingTg ? 'Saving...' : 'Save Telegram Settings'}</span>
            </button>
          </div>

          {tgTestSuccess && (
            <p className="text-xs text-[#10B981] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Test message dispatched to Telegram and in-app stream!
            </p>
          )}
        </div>

        {/* Email Dispatch & Gmail SMTP Card */}
        <div className="p-6 sm:p-7 rounded-2xl bg-white space-y-5 border border-[#E2E8F0] shadow-xs lg:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-[#E2E8F0]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-[#10B981] flex items-center justify-center border border-emerald-200">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#0F172A] tracking-tight font-['Geist',sans-serif]">Email Dispatch & Delivery Pipeline</h2>
                <p className="text-xs text-[#64748B]">Configure morning job digests and outbound email delivery</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailConf.enabled}
                onChange={(e) => setEmailConf({ ...emailConf, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#2563EB]"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-[#0F172A] block mb-1.5 uppercase tracking-wider font-['Geist',sans-serif]">
                Recipient Email (Where to send 10:00 AM digests)
              </label>
              <input
                type="email"
                placeholder="codepankaj84@gmail.com"
                value={emailConf.recipientEmail}
                onChange={(e) => setEmailConf({ ...emailConf, recipientEmail: e.target.value })}
                className="w-full text-xs text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 font-['Geist_Mono',monospace]"
              />
              <p className="text-[11px] text-[#64748B] mt-1 font-['Geist_Mono',monospace]">Default: codepankaj84@gmail.com</p>
            </div>

            <div>
              <label className="text-xs font-bold text-[#0F172A] block mb-1.5 uppercase tracking-wider font-['Geist',sans-serif]">
                Sender Display Name
              </label>
              <input
                type="text"
                placeholder="JobAgent Autonomous AI"
                value={emailConf.senderName}
                onChange={(e) => setEmailConf({ ...emailConf, senderName: e.target.value })}
                className="w-full text-xs text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3"
              />
              <p className="text-[11px] text-[#64748B] mt-1">Appears as sender on morning digests</p>
            </div>

            {/* Optional Gmail SMTP Credentials */}
            <div>
              <label className="text-xs font-bold text-[#0F172A] block mb-1.5 uppercase tracking-wider font-['Geist',sans-serif]">
                Gmail SMTP Username (Optional for direct inbox routing)
              </label>
              <input
                type="email"
                placeholder="e.g. codepankaj84@gmail.com"
                value={emailConf.smtpUser || ''}
                onChange={(e) => setEmailConf({ ...emailConf, smtpUser: e.target.value })}
                className="w-full text-xs text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 font-['Geist_Mono',monospace]"
              />
              <p className="text-[11px] text-[#64748B] mt-1 font-sans">Your Google email address</p>
            </div>

            <div>
              <label className="text-xs font-bold text-[#0F172A] block mb-1.5 uppercase tracking-wider font-['Geist',sans-serif]">
                Gmail App Password (Optional)
              </label>
              <input
                type="password"
                placeholder="••••••••••••••••"
                value={emailConf.smtpPassword || ''}
                onChange={(e) => setEmailConf({ ...emailConf, smtpPassword: e.target.value })}
                className="w-full text-xs text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] rounded-lg p-3 font-['Geist_Mono',monospace]"
              />
              <p className="text-[11px] text-[#64748B] mt-1">
                16-digit App Password from Google Account &gt; Security &gt; 2-Step Verification &gt; App Passwords.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] flex items-start gap-3 text-xs text-[#475569]">
            <Info className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              <strong className="text-[#0F172A]">Dual Email Dispatch Engine:</strong> All morning application digests are rendered in rich HTML, recorded in your in-app Email Monitor inbox, and delivered directly to your email address. If Gmail App Password is provided, messages are additionally routed through Google SMTP.
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
            <button
              onClick={handleTestEmailClick}
              disabled={isTestingEmail}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#F8FAFC] hover:bg-[#F1F5F9] text-[#334155] text-xs font-semibold border border-[#E2E8F0] transition-all disabled:opacity-50"
            >
              <Mail className="w-3.5 h-3.5 text-[#10B981]" />
              <span>{isTestingEmail ? 'Sending Test...' : 'Send Test Verification Email'}</span>
            </button>

            <button
              id="save-email-settings-btn"
              onClick={handleSaveEmail}
              disabled={isSavingEmail}
              className="huvo-glow-button flex items-center gap-1.5 px-4.5 py-2 rounded-lg text-white text-xs font-bold transition-all font-['Geist',sans-serif]"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSavingEmail ? 'Saving...' : 'Save Email Settings'}</span>
            </button>
          </div>

          {emailTestSuccess && (
            <p className="text-xs text-[#10B981] font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              {emailTestSuccess}
            </p>
          )}
        </div>
      </div>

      {/* System Baseline & Reset */}
      <div className="p-6 sm:p-7 rounded-2xl bg-white border border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
        <div>
          <h2 className="text-base font-bold text-[#0F172A] tracking-tight font-['Geist',sans-serif]">Reset Environment Baseline</h2>
          <p className="text-xs text-[#64748B] mt-1 font-sans">
            Restores initial curated candidate profile, sample job matches, cover letters, and email pipeline data.
          </p>
        </div>

        <button
          onClick={handleReset}
          disabled={isResetting}
          className="flex items-center gap-1.5 px-4.5 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-600 text-xs font-bold transition-all disabled:opacity-50 font-['Geist',sans-serif]"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
          <span>{isResetting ? 'Resetting...' : 'Reset to Demo Baseline'}</span>
        </button>
      </div>

      {resetSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-[#10B981] font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>Environment restored to clean baseline!</span>
        </div>
      )}
    </div>
  );
};
