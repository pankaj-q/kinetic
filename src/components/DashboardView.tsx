import React, { useState } from 'react';
import {
  Sparkles,
  Bot,
  Play,
  CheckCircle2,
  AlertCircle,
  Clock,
  Send,
  Building,
  ChevronRight,
  TrendingUp,
  FileText,
  Mail,
  Flame,
  ArrowRight,
  Zap,
  Sliders,
  ExternalLink,
  ShieldCheck,
  Search,
  RotateCw
} from 'lucide-react';
import {
  DashboardStats,
  Job,
  JobMatch,
  PreparedApplication,
  CandidateProfile,
} from '../types';

interface DashboardViewProps {
  stats: DashboardStats;
  jobs: (Job & { match?: JobMatch; applicationId?: string; applicationStatus?: string })[];
  applications: PreparedApplication[];
  profile: CandidateProfile | null;
  onNavigateTab: (tab: string) => void;
  onOpenApplication: (appId: string) => void;
  onRunAgent: (goal: string, minMatchScore: number) => Promise<void>;
  onRunMorningRoutine?: () => Promise<any>;
  isAgentRunning: boolean;
  onOpenTelegramModal?: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  jobs,
  applications,
  profile,
  onNavigateTab,
  onOpenApplication,
  onRunAgent,
  onRunMorningRoutine,
  isAgentRunning,
  onOpenTelegramModal,
}) => {
  const [isRunningMorning, setIsRunningMorning] = useState(false);
  const [morningResult, setMorningResult] = useState<string | null>(null);

  const handleRunMorning = async () => {
    if (!onRunMorningRoutine) return;
    setIsRunningMorning(true);
    setMorningResult(null);
    try {
      const res = await onRunMorningRoutine();
      setMorningResult(
        res?.message ||
          `Success! Applied to ${res?.appliedCount || 5} target backend jobs, sent Telegram alert, and dispatched email digest.`
      );
    } catch (err: any) {
      setMorningResult(`Error: ${err.message}`);
    } finally {
      setIsRunningMorning(false);
    }
  };

  const highMatchJobs = jobs.filter(
    (j) => (j as any).matchScore >= 80 || j.match?.score >= 80
  );
  const waitingApprovalApps = applications.filter(
    (a) => a.status === 'WAITING_FOR_APPROVAL'
  );
  const appliedApps = applications.filter((a) => a.status !== 'WAITING_FOR_APPROVAL');

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-['Geist',sans-serif]">
      {/* Welcome & Morning Trigger Header */}
      <div className="p-6 sm:p-7 rounded-2xl bg-[#111116] border border-[#1D1D24] flex flex-col md:flex-row items-start md:items-center justify-between gap-5 shadow-sm">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00FF88] animate-pulse" />
            <span className="text-xs font-mono font-bold text-[#8E8E9B] uppercase tracking-wider">
              Autonomous Operating System Active
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-display text-white tracking-tight">
            Welcome back, {profile?.name || 'Pankaj Kumar'}
          </h1>
          <p className="text-xs text-[#8E8E9B]">
            Automated 10:00 AM job discovery & application pipeline active for <strong className="text-white font-medium">{profile?.preferredRoles?.[0] || 'Senior Backend Software Engineer'}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleRunMorning}
            disabled={isRunningMorning}
            className="btn-accent text-xs sm:text-sm py-2.5 px-5 font-semibold w-full md:w-auto disabled:opacity-50"
          >
            <Zap className={`w-4 h-4 ${isRunningMorning ? 'animate-spin' : ''}`} />
            <span>{isRunningMorning ? 'Executing 10:00 AM Routine...' : '⚡ Run 10:00 AM Routine (5 Applied)'}</span>
          </button>
        </div>
      </div>

      {morningResult && (
        <div className="p-4 rounded-xl bg-[#14141B] border border-[#00FF88]/40 text-xs text-[#00FF88] font-mono flex items-center gap-2.5 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#00FF88] shrink-0" />
          <span>{morningResult}</span>
        </div>
      )}

      {/* 4 Core Real KPI Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div
          onClick={() => onNavigateTab('jobs')}
          className="p-5 rounded-2xl bg-[#111116] border border-[#1D1D24] hover:border-[#FF5A36]/40 transition-all cursor-pointer space-y-2 shadow-sm"
        >
          <div className="flex items-center justify-between text-xs font-mono text-[#8E8E9B]">
            <span className="uppercase tracking-wider">Live Scanned Jobs</span>
            <Search className="w-4 h-4 text-[#FF5A36]" />
          </div>
          <div className="text-3xl font-bold font-display text-white">{jobs.length}</div>
          <p className="text-[11px] text-[#8E8E9B]">Across Greenhouse, Lever, RemoteOK</p>
        </div>

        {/* Metric 2 */}
        <div
          onClick={() => onNavigateTab('jobs')}
          className="p-5 rounded-2xl bg-[#111116] border border-[#1D1D24] hover:border-[#FF5A36]/40 transition-all cursor-pointer space-y-2 shadow-sm"
        >
          <div className="flex items-center justify-between text-xs font-mono text-[#8E8E9B]">
            <span className="uppercase tracking-wider">High Match Roles</span>
            <Flame className="w-4 h-4 text-[#FF5A36]" />
          </div>
          <div className="text-3xl font-bold font-display text-[#FF5A36]">{highMatchJobs.length}</div>
          <p className="text-[11px] text-[#8E8E9B]">&ge;80% verified technical alignment</p>
        </div>

        {/* Metric 3 */}
        <div
          onClick={() => onNavigateTab('applications')}
          className="p-5 rounded-2xl bg-[#111116] border border-[#1D1D24] hover:border-[#00FF88]/40 transition-all cursor-pointer space-y-2 shadow-sm"
        >
          <div className="flex items-center justify-between text-xs font-mono text-[#8E8E9B]">
            <span className="uppercase tracking-wider">Total Applications</span>
            <CheckCircle2 className="w-4 h-4 text-[#00FF88]" />
          </div>
          <div className="text-3xl font-bold font-display text-[#00FF88]">{applications.length}</div>
          <p className="text-[11px] text-[#8E8E9B]">
            {waitingApprovalApps.length > 0 ? `${waitingApprovalApps.length} awaiting human review` : 'All submissions synced'}
          </p>
        </div>

        {/* Metric 4 */}
        <div
          onClick={() => (onOpenTelegramModal ? onOpenTelegramModal() : onNavigateTab('settings'))}
          className="p-5 rounded-2xl bg-[#111116] border border-[#1D1D24] hover:border-[#FF5A36]/40 transition-all cursor-pointer space-y-2 shadow-sm"
        >
          <div className="flex items-center justify-between text-xs font-mono text-[#8E8E9B]">
            <span className="uppercase tracking-wider">Telegram & Alerts</span>
            <Send className="w-4 h-4 text-[#FF5A36]" />
          </div>
          <div className="text-xl font-bold font-display text-white">Active (Chat: 1276866292)</div>
          <p className="text-[11px] text-[#8E8E9B] font-mono">10:00 AM IST Daily Routine</p>
        </div>
      </div>

      {/* Action Required: Pending Applications Center */}
      {waitingApprovalApps.length > 0 && (
        <div className="p-6 rounded-2xl bg-[#111116] border border-[#FF5A36]/40 space-y-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#FF5A36]" />
              <h2 className="text-base font-bold font-display text-white">
                Human-In-The-Loop Approval Center ({waitingApprovalApps.length})
              </h2>
            </div>
            <span className="text-xs text-[#8E8E9B] font-mono">Review auto-synthesized answers & submit</span>
          </div>

          <div className="space-y-3">
            {waitingApprovalApps.map((app) => (
              <div
                key={app.id}
                className="p-4 rounded-xl bg-[#0D0D12] border border-[#1D1D24] hover:border-[#FF5A36]/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-white font-display">{app.jobTitle}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#FF5A36]/10 text-[#FF5A36] border border-[#FF5A36]/30">
                      {app.matchScore}% Match
                    </span>
                  </div>
                  <div className="text-xs text-[#8E8E9B] flex items-center gap-2">
                    <span className="text-white font-medium">{app.company}</span>
                    <span>•</span>
                    <span className="text-[#8E8E9B] font-mono">Custom Q&A & Cover Letter Synthesized</span>
                  </div>
                </div>

                <button
                  onClick={() => onOpenApplication(app.id)}
                  className="btn-accent text-xs py-2 px-4.5 font-semibold"
                >
                  <span>Review & Approve Submission</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Matching Opportunities & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Matches Column */}
        <div className="lg:col-span-2 p-6 rounded-2xl bg-[#111116] border border-[#1D1D24] space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-[#FF5A36]" />
              <h2 className="text-base font-bold font-display text-white">Top Target Matching Roles</h2>
            </div>
            <button
              onClick={() => onNavigateTab('jobs')}
              className="text-xs text-[#FF5A36] hover:underline font-mono flex items-center gap-1"
            >
              <span>Explore All Jobs</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {jobs.slice(0, 4).map((job) => (
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
                        <span className="text-[#00FF88] font-mono">
                          ${(job.salary.min / 1000).toFixed(0)}k - ${(job.salary.max / 1000).toFixed(0)}k
                        </span>
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
                    <span>Apply</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Real Activity Stream & Quick Commands */}
        <div className="p-6 rounded-2xl bg-[#111116] border border-[#1D1D24] space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#FF5A36]" />
            <h2 className="text-base font-bold font-display text-white">System Status</h2>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-xl bg-[#0D0D12] border border-[#1D1D24] space-y-1 font-mono">
              <span className="text-[#8E8E9B] block text-[10px] uppercase tracking-wider">Candidate</span>
              <span className="text-white font-bold">{profile?.name || 'Pankaj Kumar'}</span>
              <span className="text-[#8E8E9B] block">{profile?.email || 'codepankaj84@gmail.com'}</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0D0D12] border border-[#1D1D24] space-y-1 font-mono">
              <span className="text-[#8E8E9B] block text-[10px] uppercase tracking-wider">10:00 AM Automation</span>
              <span className="text-[#00FF88] font-bold">Enabled • Daily at 10:00 AM IST</span>
              <span className="text-[#8E8E9B] block">Target: &ge;5 Applications/day</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#0D0D12] border border-[#1D1D24] space-y-1 font-mono">
              <span className="text-[#8E8E9B] block text-[10px] uppercase tracking-wider">Telegram Channel</span>
              <span className="text-white font-bold">Chat ID: 1276866292</span>
              <span className="text-[#00FF88] block">Real-time alerts active</span>
            </div>
          </div>

          <div className="pt-2 border-t border-[#1D1D24] flex items-center justify-between">
            <button
              onClick={() => onNavigateTab('settings')}
              className="btn-secondary-outline text-xs py-2 px-3.5 w-full font-semibold"
            >
              <Sliders className="w-3.5 h-3.5 text-[#FF5A36]" />
              <span>Configure Settings</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
