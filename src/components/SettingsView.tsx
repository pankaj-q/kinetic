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
  Moon,
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
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
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
  theme = 'dark',
  onToggleTheme,
}) => {
  const [tg, setTg] = useState<TelegramConfig>(telegramConfig);
  const [sched, setSched] = useState<SchedulerConfig>(schedulerConfig);
  const [emailConf, setEmailConf] = useState<EmailDispatchConfig>(
    emailConfig || {
      enabled: true,
      recipientEmail: 'codepankaj84@gmail.com',
      senderName: 'Kinetic Autonomous AI',
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
    if (window.confirm('Reset all jobs, matches, applications, and logs back to the clean baseline?')) {
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
          <div className="w-9 h-9 rounded-xl bg-[#111116] flex items-center justify-center border border-[#1D1D24] text-[#FF5A36] shadow-sm">
            <Sliders className="w-4 h-4" />
          </div>
          <h1 className="text-2xl font-bold font-display text-white tracking-tight">
            Automation, Telegram & Theme Settings
          </h1>
        </div>
        <p className="text-xs text-[#8E8E9B] mt-0.5 font-sans">
          Configure autonomous 10:00 AM daily job applications, 1-click Telegram alerts, and interface theme.
        </p>
      </div>

      {/* Theme Selection Banner */}
      <div className="p-5 rounded-2xl bg-[#111116] border border-[#1D1D24] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#181822] border border-[#1D1D24] flex items-center justify-center text-[#FF5A36]">
            {theme === 'dark' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
          </div>
          <div>
            <h2 className="text-sm font-bold font-display text-white">Interface Appearance</h2>
            <p className="text-xs text-[#8E8E9B]">
              Current mode: <strong className="text-white capitalize">{theme} Mode</strong>
            </p>
          </div>
        </div>

        {onToggleTheme && (
          <div className="flex items-center gap-2">
            <button
              onClick={() => theme !== 'dark' && onToggleTheme()}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                theme === 'dark'
                  ? 'bg-[#FF5A36] text-white shadow-sm'
                  : 'bg-[#181822] text-[#8E8E9B] hover:text-white border border-[#1D1D24]'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
              <span>Dark Obsidian</span>
            </button>

            <button
              onClick={() => theme !== 'light' && onToggleTheme()}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold transition-all cursor-pointer ${
                theme === 'light'
                  ? 'bg-[#FF5A36] text-white shadow-sm'
                  : 'bg-[#181822] text-[#8E8E9B] hover:text-white border border-[#1D1D24]'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
              <span>Clean Light</span>
            </button>
          </div>
        )}
      </div>

      {/* Featured 10:00 AM Morning Job Routine Quick Banner */}
      <div className="p-6 rounded-2xl bg-[#111116] border border-[#FF5A36]/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#FF5A36]/10 text-[#FF5A36] flex items-center justify-center shrink-0 border border-[#FF5A36]/30">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold font-display text-white tracking-tight">Daily 10:00 AM Autonomous Pipeline</h2>
              <span className="px-2 py-0.5 rounded-full bg-[#14141B] text-[#00FF88] text-[10px] font-bold border border-[#00FF88]/30 font-mono">
                SCHEDULED
              </span>
            </div>
            <p className="text-xs text-[#8E8E9B] mt-1 max-w-xl leading-relaxed">
              Every morning at <strong className="text-white font-mono">10:00 AM IST</strong>, the agent scans live boards, scores matches, prepares & applies to at least <strong className="text-white font-semibold">5 target jobs</strong>, sends a full summary on <strong className="text-white font-semibold">Telegram</strong>, and delivers an email digest to <strong className="text-[#FF5A36] font-mono">{emailConf.recipientEmail}</strong>.
            </p>
          </div>
        </div>

        <button
          id="run-morning-test-now-btn"
          onClick={handleRunMorningTest}
          disabled={isRunningMorning}
          className="btn-accent text-xs py-2.5 px-5 font-semibold shrink-0 disabled:opacity-50"
        >
          <Zap className={`w-4 h-4 ${isRunningMorning ? 'animate-spin' : ''}`} />
          <span>{isRunningMorning ? 'Running 10:00 AM Routine...' : '⚡ Test 10:00 AM Routine (5 Applied)'}</span>
        </button>
      </div>

      {morningResult && (
        <div className="p-4 rounded-xl bg-[#14141B] border border-[#00FF88]/40 text-xs text-[#00FF88] font-semibold flex items-center gap-2.5 animate-in fade-in font-mono">
          <CheckCircle2 className="w-4 h-4 text-[#00FF88] shrink-0" />
          <span>{morningResult}</span>
        </div>
      )}

      {/* 2-Column Settings Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scheduler & 10:00 AM Daily Routine Card */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[#111116] border border-[#1D1D24] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#1D1D24]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#14141B] text-[#FF5A36] flex items-center justify-center border border-[#1D1D24]">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold font-display text-white tracking-tight">Daily Schedule & Automation Rules</h2>
                <p className="text-xs text-[#8E8E9B]">Autonomous morning execution triggers</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={sched.active}
                onChange={(e) => setSched({ ...sched, active: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-[#1D1D24] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF5A36]"></div>
            </label>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-mono font-bold text-[#8E8E9B] block mb-1.5 uppercase tracking-wider">
                  Morning Trigger Time
                </label>
                <input
                  type="text"
                  placeholder="10:00"
                  value={sched.dailyMorningTime || '10:00'}
                  onChange={(e) => setSched({ ...sched, dailyMorningTime: e.target.value })}
                  className="w-full text-xs text-white bg-[#070709] border border-[#1D1D24] rounded-lg p-3 font-mono focus:outline-none focus:border-[#FF5A36]"
                />
                <p className="text-[10px] text-[#5A5A66] mt-1 font-mono">24-hour format (e.g. 10:00 = 10:00 AM IST)</p>
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-[#8E8E9B] block mb-1.5 uppercase tracking-wider">
                  Daily Min Jobs to Apply
                </label>
                <input
                  type="number"
                  min={1}
                  max={20}
                  value={sched.minJobsToApplyDaily || 5}
                  onChange={(e) => setSched({ ...sched, minJobsToApplyDaily: Number(e.target.value) })}
                  className="w-full text-xs text-white bg-[#070709] border border-[#1D1D24] rounded-lg p-3 font-mono focus:outline-none focus:border-[#FF5A36]"
                />
                <p className="text-[10px] text-[#5A5A66] mt-1 font-mono">Target &ge; 5 applications per morning</p>
              </div>
            </div>

            <div>
              <label className="text-xs font-mono font-bold text-[#8E8E9B] block mb-1.5 uppercase tracking-wider">
                Auto-Prepare Minimum Match Score: <span className="text-[#FF5A36]">{sched.minMatchScoreForAutoPrepare}%</span>
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
                className="w-full accent-[#FF5A36] bg-[#1D1D24]"
              />
              <p className="text-[11px] text-[#8E8E9B] mt-1">
                Jobs with match scores at or above this threshold will automatically have tailored cover letters and applications synthesized.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0D0D12] border border-[#1D1D24] space-y-1.5 text-xs text-[#8E8E9B] font-mono">
              <div className="flex justify-between">
                <span>Morning Routine:</span>
                <span className="text-[#FF5A36] font-bold">Every Day @ {sched.dailyMorningTime || '10:00'} AM</span>
              </div>
              <div className="flex justify-between">
                <span>Last Run:</span>
                <span className="text-white">
                  {sched.lastRunAt ? new Date(sched.lastRunAt).toLocaleTimeString() : 'Pending'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Next Scheduled Run:</span>
                <span className="text-[#00FF88]">
                  {sched.nextRunAt ? new Date(sched.nextRunAt).toLocaleTimeString() : 'Tomorrow 10:00 AM IST'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#1D1D24]">
            <button
              onClick={handleTriggerScheduler}
              disabled={isTriggeringSched}
              className="btn-secondary-outline text-xs py-2 px-3.5 disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 text-[#FF5A36]" />
              <span>{isTriggeringSched ? 'Triggering...' : 'Trigger Cycle Now'}</span>
            </button>

            <button
              id="save-scheduler-settings-btn"
              onClick={handleSaveScheduler}
              disabled={isSavingSched}
              className="btn-accent text-xs py-2 px-4.5 font-semibold"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSavingSched ? 'Saving...' : 'Save Schedule Settings'}</span>
            </button>
          </div>

          {schedTriggerSuccess && (
            <p className="text-xs text-[#00FF88] font-semibold flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-4 h-4 text-[#00FF88]" />
              Scheduled cycle triggered successfully!
            </p>
          )}
        </div>

        {/* Telegram Bot Integration Card (Easy 2-Click Connect) */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[#111116] border border-[#1D1D24] space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-[#1D1D24]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#14141B] text-[#FF5A36] flex items-center justify-center border border-[#1D1D24]">
                <Send className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold font-display text-white tracking-tight">Telegram Real-Time Alerts</h2>
                <p className="text-xs text-[#8E8E9B]">Easy 2-click bot connection</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={tg.enabled}
                onChange={(e) => setTg({ ...tg, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-[#1D1D24] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF5A36]"></div>
            </label>
          </div>

          {/* Quick Helper Links */}
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <a
              href="https://t.me/BotFather"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-[#0D0D12] border border-[#1D1D24] hover:border-[#FF5A36]/40 flex items-center justify-between text-[#CCCCCC] hover:text-white transition-all"
            >
              <span>1. Get Bot Token</span>
              <ExternalLink className="w-3 h-3 text-[#FF5A36]" />
            </a>
            <a
              href="https://t.me/userinfobot"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl bg-[#0D0D12] border border-[#1D1D24] hover:border-[#FF5A36]/40 flex items-center justify-between text-[#CCCCCC] hover:text-white transition-all"
            >
              <span>2. Get Chat ID</span>
              <ExternalLink className="w-3 h-3 text-[#FF5A36]" />
            </a>
          </div>

          <div className="space-y-3.5">
            <div>
              <label className="text-xs font-mono font-bold text-[#8E8E9B] block mb-1.5 uppercase tracking-wider">
                Telegram Bot Token
              </label>
              <input
                type="text"
                placeholder="e.g. 7123456789:AAFx9_exampleBotToken"
                value={tg.botToken}
                onChange={(e) => setTg({ ...tg, botToken: e.target.value })}
                className="w-full text-xs text-white bg-[#070709] border border-[#1D1D24] rounded-lg p-3 font-mono focus:outline-none focus:border-[#FF5A36]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono font-bold text-[#8E8E9B] uppercase tracking-wider">
                  Telegram Chat ID
                </label>
                <button
                  type="button"
                  onClick={() => setTg({ ...tg, chatId: '1276866292' })}
                  className="text-[11px] text-[#FF5A36] hover:underline font-mono"
                >
                  Use: 1276866292
                </button>
              </div>
              <input
                type="text"
                placeholder="e.g. 1276866292"
                value={tg.chatId}
                onChange={(e) => setTg({ ...tg, chatId: e.target.value })}
                className="w-full text-xs text-white bg-[#070709] border border-[#1D1D24] rounded-lg p-3 font-mono focus:outline-none focus:border-[#FF5A36]"
              />
            </div>

            {/* Notification Checkboxes */}
            <div className="space-y-2.5 pt-2.5 border-t border-[#1D1D24]">
              <span className="text-xs font-mono font-bold text-[#8E8E9B] block uppercase tracking-wider">Notification Events</span>

              <label className="flex items-center gap-2.5 text-xs text-[#CCCCCC] cursor-pointer">
                <input
                  type="checkbox"
                  checked={tg.morningReportEnabled !== false}
                  onChange={(e) => setTg({ ...tg, morningReportEnabled: e.target.checked })}
                  className="rounded text-[#FF5A36] focus:ring-[#FF5A36] bg-[#070709] border-[#1D1D24]"
                />
                <span className="font-semibold text-[#FF5A36]">10:00 AM Morning Job Report (5+ applied jobs)</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-[#CCCCCC] cursor-pointer">
                <input
                  type="checkbox"
                  checked={tg.notifyOnHighMatch}
                  onChange={(e) => setTg({ ...tg, notifyOnHighMatch: e.target.checked })}
                  className="rounded text-[#FF5A36] focus:ring-[#FF5A36] bg-[#070709] border-[#1D1D24]"
                />
                <span>High Match Job Discovered (&gt;80%)</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-[#CCCCCC] cursor-pointer">
                <input
                  type="checkbox"
                  checked={tg.notifyOnSubmission}
                  onChange={(e) => setTg({ ...tg, notifyOnSubmission: e.target.checked })}
                  className="rounded text-[#FF5A36] focus:ring-[#FF5A36] bg-[#070709] border-[#1D1D24]"
                />
                <span>Application Submission Confirmation</span>
              </label>

              <label className="flex items-center gap-2.5 text-xs text-[#CCCCCC] cursor-pointer">
                <input
                  type="checkbox"
                  checked={tg.notifyOnInterview}
                  onChange={(e) => setTg({ ...tg, notifyOnInterview: e.target.checked })}
                  className="rounded text-[#FF5A36] focus:ring-[#FF5A36] bg-[#070709] border-[#1D1D24]"
                />
                <span>Recruiter Interview & Offer Invitations</span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#1D1D24]">
            <button
              onClick={handleTestTelegram}
              disabled={isTestingTg}
              className="btn-secondary-outline text-xs py-2 px-3.5 disabled:opacity-50"
            >
              <Send className="w-3.5 h-3.5 text-[#FF5A36]" />
              <span>{isTestingTg ? 'Sending Ping...' : 'Send Test Ping'}</span>
            </button>

            <button
              id="save-telegram-settings-btn"
              onClick={handleSaveTelegram}
              disabled={isSavingTg}
              className="btn-accent text-xs py-2 px-4.5 font-semibold"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSavingTg ? 'Saving...' : 'Save Telegram Settings'}</span>
            </button>
          </div>

          {tgTestSuccess && (
            <p className="text-xs text-[#00FF88] font-semibold flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-4 h-4 text-[#00FF88]" />
              Test message dispatched to Telegram!
            </p>
          )}
        </div>

        {/* Email Dispatch & Gmail SMTP Card */}
        <div className="p-6 sm:p-7 rounded-2xl bg-[#111116] border border-[#1D1D24] space-y-5 lg:col-span-2">
          <div className="flex items-center justify-between pb-3 border-b border-[#1D1D24]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#14141B] text-[#FF5A36] flex items-center justify-center border border-[#1D1D24]">
                <Mail className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold font-display text-white tracking-tight">Email Dispatch & Delivery Pipeline</h2>
                <p className="text-xs text-[#8E8E9B]">Configure morning job digests and outbound email delivery</p>
              </div>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailConf.enabled}
                onChange={(e) => setEmailConf({ ...emailConf, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-[#1D1D24] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#FF5A36]"></div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-mono font-bold text-[#8E8E9B] block mb-1.5 uppercase tracking-wider">
                Recipient Email (Where to send 10:00 AM digests)
              </label>
              <input
                type="email"
                placeholder="codepankaj84@gmail.com"
                value={emailConf.recipientEmail}
                onChange={(e) => setEmailConf({ ...emailConf, recipientEmail: e.target.value })}
                className="w-full text-xs text-white bg-[#070709] border border-[#1D1D24] rounded-lg p-3 font-mono focus:outline-none focus:border-[#FF5A36]"
              />
              <p className="text-[11px] text-[#5A5A66] mt-1 font-mono">Default: codepankaj84@gmail.com</p>
            </div>

            <div>
              <label className="text-xs font-mono font-bold text-[#8E8E9B] block mb-1.5 uppercase tracking-wider">
                Sender Display Name
              </label>
              <input
                type="text"
                placeholder="Kinetic Autonomous AI"
                value={emailConf.senderName}
                onChange={(e) => setEmailConf({ ...emailConf, senderName: e.target.value })}
                className="w-full text-xs text-white bg-[#070709] border border-[#1D1D24] rounded-lg p-3 focus:outline-none focus:border-[#FF5A36]"
              />
              <p className="text-[11px] text-[#5A5A66] mt-1">Appears as sender on morning digests</p>
            </div>

            {/* Optional Gmail SMTP Credentials */}
            <div>
              <label className="text-xs font-mono font-bold text-[#8E8E9B] block mb-1.5 uppercase tracking-wider">
                Gmail SMTP Username (Optional for direct inbox routing)
              </label>
              <input
                type="email"
                placeholder="e.g. codepankaj84@gmail.com"
                value={emailConf.smtpUser || ''}
                onChange={(e) => setEmailConf({ ...emailConf, smtpUser: e.target.value })}
                className="w-full text-xs text-white bg-[#070709] border border-[#1D1D24] rounded-lg p-3 font-mono focus:outline-none focus:border-[#FF5A36]"
              />
              <p className="text-[11px] text-[#5A5A66] mt-1 font-sans">Your Google email address</p>
            </div>

            <div>
              <label className="text-xs font-mono font-bold text-[#8E8E9B] block mb-1.5 uppercase tracking-wider">
                Gmail App Password (Optional)
              </label>
              <input
                type="password"
                placeholder="••••••••••••••••"
                value={emailConf.smtpPassword || ''}
                onChange={(e) => setEmailConf({ ...emailConf, smtpPassword: e.target.value })}
                className="w-full text-xs text-white bg-[#070709] border border-[#1D1D24] rounded-lg p-3 font-mono focus:outline-none focus:border-[#FF5A36]"
              />
              <p className="text-[11px] text-[#5A5A66] mt-1">
                16-digit App Password from Google Account Security.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#0D0D12] border border-[#1D1D24] flex items-start gap-3 text-xs text-[#8E8E9B]">
            <Info className="w-4 h-4 text-[#FF5A36] shrink-0 mt-0.5" />
            <span className="leading-relaxed">
              <strong className="text-white">Dual Email Dispatch Engine:</strong> All morning application digests are rendered in rich HTML, recorded in your in-app Email Monitor inbox, and delivered directly to your email address.
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-[#1D1D24]">
            <button
              onClick={handleTestEmailClick}
              disabled={isTestingEmail}
              className="btn-secondary-outline text-xs py-2 px-3.5 disabled:opacity-50"
            >
              <Mail className="w-3.5 h-3.5 text-[#FF5A36]" />
              <span>{isTestingEmail ? 'Sending Test...' : 'Send Test Verification Email'}</span>
            </button>

            <button
              id="save-email-settings-btn"
              onClick={handleSaveEmail}
              disabled={isSavingEmail}
              className="btn-accent text-xs py-2 px-4.5 font-semibold"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSavingEmail ? 'Saving...' : 'Save Email Settings'}</span>
            </button>
          </div>

          {emailTestSuccess && (
            <p className="text-xs text-[#00FF88] font-semibold flex items-center gap-1 font-mono">
              <CheckCircle2 className="w-4 h-4 text-[#00FF88]" />
              {emailTestSuccess}
            </p>
          )}
        </div>
      </div>

      {/* System Baseline & Reset */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#111116] border border-[#1D1D24] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-base font-bold font-display text-white tracking-tight">Reset Environment Baseline</h2>
          <p className="text-xs text-[#8E8E9B] mt-1 font-sans">
            Restores initial curated candidate profile, sample job matches, cover letters, and email pipeline data.
          </p>
        </div>

        <button
          onClick={handleReset}
          disabled={isResetting}
          className="btn-secondary-outline text-xs py-2 px-4.5 font-semibold text-rose-400 hover:border-rose-500 disabled:opacity-50"
        >
          <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
          <span>{isResetting ? 'Resetting...' : 'Reset to Baseline'}</span>
        </button>
      </div>

      {resetSuccess && (
        <div className="p-4 rounded-xl bg-[#14141B] border border-[#00FF88]/40 text-xs text-[#00FF88] font-semibold flex items-center gap-2 font-mono">
          <CheckCircle2 className="w-4 h-4" />
          <span>Environment restored to clean baseline!</span>
        </div>
      )}
    </div>
  );
};
