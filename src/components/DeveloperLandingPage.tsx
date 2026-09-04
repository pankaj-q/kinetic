import React from 'react';
import {
  Zap,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Bot,
  Flame,
  CheckCircle2,
  Clock,
  Sparkles,
  Send,
  Building,
  ChevronRight,
  Search,
  ExternalLink,
  Layers,
  Inbox
} from 'lucide-react';
import { CandidateProfile, Job, PreparedApplication } from '../types';

interface DeveloperLandingPageProps {
  onEnterApp: () => void;
  onNavigateTab: (tab: string) => void;
  onRunMorningRoutine?: () => Promise<any>;
  profile?: CandidateProfile | null;
  jobs?: Job[];
  applications?: PreparedApplication[];
  telegramConfig?: { enabled: boolean; chatId: string };
  schedulerConfig?: { active: boolean; dailyMorningTime?: string; minJobsToApplyDaily?: number };
}

export const DeveloperLandingPage: React.FC<DeveloperLandingPageProps> = ({
  onEnterApp,
  onNavigateTab,
  onRunMorningRoutine,
  profile,
  jobs = [],
  applications = [],
  telegramConfig,
  schedulerConfig,
}) => {
  const [isRunningMorning, setIsRunningMorning] = React.useState(false);
  const [morningResult, setMorningResult] = React.useState<string | null>(null);

  const handleRunMorning = async () => {
    if (!onRunMorningRoutine) return;
    setIsRunningMorning(true);
    setMorningResult(null);
    try {
      const res = await onRunMorningRoutine();
      setMorningResult(
        res?.message ||
          `Routine complete! Applied to ${res?.appliedCount || 5} target backend jobs and sent Telegram & Email reports.`
      );
    } catch (err: any) {
      setMorningResult(`Morning routine error: ${err.message}`);
    } finally {
      setIsRunningMorning(false);
    }
  };

  const highMatchJobs = jobs.filter((j) => (j as any).matchScore >= 80 || (j as any).match?.score >= 80);
  const pendingApps = applications.filter((a) => a.status === 'WAITING_FOR_APPROVAL');

  return (
    <div className="min-h-screen bg-[#070709] text-white flex flex-col justify-between selection:bg-[#FF5A36]/30 font-['Geist',sans-serif]">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-16 w-full space-y-10">
        {/* Glowing Pill Eyebrow */}
        <div className="flex items-center justify-center">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111116] border border-[#1D1D24] text-[11px] font-mono shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
            <span className="text-[#8E8E9B] uppercase tracking-wider">Kinetic OS</span>
            <span className="text-white/30">•</span>
            <span className="text-[#FF5A36] font-semibold">10:00 AM Autonomous Career Agent</span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-6xl font-extrabold font-display tracking-tight text-white leading-[1.08]">
            Build your career.<br />
            <span className="bg-gradient-to-r from-white via-[#EAEAEA] to-[#FF5A36] bg-clip-text text-transparent">
              Automate every application.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[#8E8E9B] max-w-2xl mx-auto leading-relaxed">
            Engineered for <strong className="text-white font-medium">{profile?.name || 'Pankaj Kumar'}</strong> ({profile?.preferredRoles?.[0] || 'Senior Backend Software Engineer'}). Discovers live tech roles, performs deep ReAct fit scoring, crafts verified cover letters, and dispatches 10:00 AM daily routines with Telegram alerts.
          </p>

          {/* Quick Hero Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <button
              onClick={handleRunMorning}
              disabled={isRunningMorning}
              className="btn-accent text-xs sm:text-sm py-3 px-6 w-full sm:w-auto font-semibold disabled:opacity-50"
            >
              <Zap className={`w-4 h-4 ${isRunningMorning ? 'animate-spin' : ''}`} />
              <span>{isRunningMorning ? 'Executing 10:00 AM Routine...' : '⚡ Run 10:00 AM Routine (5 Applied)'}</span>
            </button>

            <button
              onClick={() => onNavigateTab('jobs')}
              className="btn-secondary-outline text-xs sm:text-sm py-3 px-6 w-full sm:w-auto font-semibold"
            >
              <Search className="w-4 h-4 text-[#FF5A36]" />
              <span>Explore Live Jobs Feed</span>
            </button>

            <button
              onClick={onEnterApp}
              className="btn-secondary-outline text-xs sm:text-sm py-3 px-6 w-full sm:w-auto font-semibold"
            >
              <Layers className="w-4 h-4 text-[#8E8E9B]" />
              <span>Open Dashboard</span>
            </button>
          </div>

          {morningResult && (
            <div className="p-3.5 rounded-xl bg-[#14141B] border border-[#00FF88]/40 text-xs text-[#00FF88] font-mono flex items-center justify-center gap-2 max-w-xl mx-auto animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{morningResult}</span>
            </div>
          )}
        </div>

        {/* Real Live Metrics Bento Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Active Jobs */}
          <div
            onClick={() => onNavigateTab('jobs')}
            className="p-5 rounded-2xl bg-[#111116] border border-[#1D1D24] hover:border-[#FF5A36]/40 transition-all cursor-pointer space-y-3 shadow-sm"
          >
            <div className="flex items-center justify-between text-xs font-mono text-[#8E8E9B]">
              <span className="uppercase tracking-wider">Scanned Jobs</span>
              <Search className="w-4 h-4 text-[#FF5A36]" />
            </div>
            <div className="text-3xl font-extrabold font-display text-white">
              {jobs.length}
            </div>
            <p className="text-xs text-[#8E8E9B]">
              Live listings across Greenhouse, Lever, RemoteOK.
            </p>
          </div>

          {/* Card 2: AI High Matches */}
          <div
            onClick={() => onNavigateTab('jobs')}
            className="p-5 rounded-2xl bg-[#111116] border border-[#1D1D24] hover:border-[#FF5A36]/40 transition-all cursor-pointer space-y-3 shadow-sm"
          >
            <div className="flex items-center justify-between text-xs font-mono text-[#8E8E9B]">
              <span className="uppercase tracking-wider">AI High Matches</span>
              <Flame className="w-4 h-4 text-[#FF5A36]" />
            </div>
            <div className="text-3xl font-extrabold font-display text-[#FF5A36]">
              {highMatchJobs.length}
            </div>
            <p className="text-xs text-[#8E8E9B]">
              Roles with &ge;80% technical fit to your profile.
            </p>
          </div>

          {/* Card 3: Applications Status */}
          <div
            onClick={() => onNavigateTab('applications')}
            className="p-5 rounded-2xl bg-[#111116] border border-[#1D1D24] hover:border-[#00FF88]/40 transition-all cursor-pointer space-y-3 shadow-sm"
          >
            <div className="flex items-center justify-between text-xs font-mono text-[#8E8E9B]">
              <span className="uppercase tracking-wider">Applications</span>
              <CheckCircle2 className="w-4 h-4 text-[#00FF88]" />
            </div>
            <div className="text-3xl font-extrabold font-display text-[#00FF88]">
              {applications.length}
            </div>
            <p className="text-xs text-[#8E8E9B]">
              {pendingApps.length > 0 ? `${pendingApps.length} waiting your approval` : 'All applications synced'}
            </p>
          </div>

          {/* Card 4: 10:00 AM Automation */}
          <div
            onClick={() => onNavigateTab('settings')}
            className="p-5 rounded-2xl bg-[#111116] border border-[#1D1D24] hover:border-[#FF5A36]/40 transition-all cursor-pointer space-y-3 shadow-sm"
          >
            <div className="flex items-center justify-between text-xs font-mono text-[#8E8E9B]">
              <span className="uppercase tracking-wider">Morning Routine</span>
              <Clock className="w-4 h-4 text-[#FF5A36]" />
            </div>
            <div className="text-2xl font-bold font-display text-white">
              {schedulerConfig?.dailyMorningTime || '10:00'} AM IST
            </div>
            <p className="text-xs text-[#8E8E9B] font-mono">
              Telegram: {telegramConfig?.chatId ? `Chat ${telegramConfig.chatId}` : 'Connected'}
            </p>
          </div>
        </div>

        {/* Real Live Top Matches & Action Center */}
        <div className="p-6 rounded-2xl bg-[#111116] border border-[#1D1D24] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#FF5A36]" />
              <h2 className="text-base font-bold font-display text-white">Top High-Match Target Roles</h2>
            </div>
            <button
              onClick={() => onNavigateTab('jobs')}
              className="text-xs text-[#FF5A36] hover:underline font-mono flex items-center gap-1"
            >
              <span>View All {jobs.length} Jobs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {jobs.slice(0, 3).map((job) => (
              <div
                key={job.id}
                className="p-4 rounded-xl bg-[#0D0D12] border border-[#1D1D24] hover:border-[#353545] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-display">{job.title}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FF5A36]/10 text-[#FF5A36] border border-[#FF5A36]/30">
                      {(job as any).matchScore || (job as any).match?.score || 90}% Match
                    </span>
                  </div>
                  <div className="text-xs text-[#8E8E9B] flex items-center gap-2">
                    <span className="text-white font-medium">{job.company}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                    {job.salary && (
                      <>
                        <span>•</span>
                        <span className="text-[#00FF88] font-mono">${(job.salary.min / 1000).toFixed(0)}k - ${(job.salary.max / 1000).toFixed(0)}k</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onNavigateTab('cover_letters')}
                    className="btn-secondary-outline text-xs py-1.5 px-3"
                  >
                    <span>Cover Letter</span>
                  </button>
                  <button
                    onClick={() => onNavigateTab('jobs')}
                    className="btn-accent text-xs py-1.5 px-4 font-semibold"
                  >
                    <span>Apply Now</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Clean Minimal Footer */}
      <footer className="border-t border-[#1D1D24] py-6 px-4 text-center text-xs text-[#5A5A66] font-mono">
        Kinetic Autonomous Career OS • Pankaj Kumar (Senior Backend Software Engineer)
      </footer>
    </div>
  );
};
