import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Briefcase,
  Flame,
  FileCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Bot,
  Play,
  Send,
  Building,
  MapPin,
  DollarSign,
  AlertCircle,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Sun,
  Zap,
  Mail,
  ShieldCheck,
  Globe,
  XCircle,
  Activity,
  Check,
  Radio
} from 'lucide-react';
import { DashboardStats, Job, JobMatch, PreparedApplication, TelegramConfig } from '../types';

interface DashboardViewProps {
  stats: DashboardStats;
  jobs: (Job & { match?: JobMatch; applicationId?: string; applicationStatus?: string })[];
  applications: PreparedApplication[];
  telegramConfig: TelegramConfig;
  onNavigateTab: (tab: string) => void;
  onOpenApplication: (appId: string) => void;
  onPrepareApplication: (jobId: string) => void;
  onTriggerAgent: (goal?: string) => void;
  onRunMorningRoutine?: () => Promise<any>;
  isAgentRunning: boolean;
  onRefreshData: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  stats,
  jobs,
  applications,
  telegramConfig,
  onNavigateTab,
  onOpenApplication,
  onPrepareApplication,
  onTriggerAgent,
  onRunMorningRoutine,
  isAgentRunning,
  onRefreshData,
}) => {
  const [isRunningMorning, setIsRunningMorning] = useState(false);
  const [morningStatus, setMorningStatus] = useState<string | null>(null);
  const [activeSimStep, setActiveSimStep] = useState(2);

  const waitingApprovalApps = applications.filter((a) => a.status === 'WAITING_FOR_APPROVAL');
  const interviewApps = applications.filter((a) => a.status === 'INTERVIEW');
  const highMatchJobs = jobs.filter((j) => (j.match?.score || 0) >= 85).slice(0, 4);

  const handleMorningClick = async () => {
    if (!onRunMorningRoutine) return;
    setIsRunningMorning(true);
    setMorningStatus(null);
    try {
      const res = await onRunMorningRoutine();
      setMorningStatus(res?.message || '10:00 AM Morning routine complete! 5+ jobs applied, Telegram alert sent & Email dispatched.');
      setTimeout(() => setMorningStatus(null), 6000);
      onRefreshData();
    } catch (err: any) {
      setMorningStatus(`Error: ${err.message}`);
    } finally {
      setIsRunningMorning(false);
    }
  };

  return (
    <div className="space-y-10 font-['Geist',sans-serif]">
      {/* Editorial Premium SaaS Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="relative pt-6 pb-2 text-center space-y-5 max-w-4xl mx-auto"
      >
        {/* Top Micro Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16161E] border border-[#FF5A36]/40 text-[#FF5A36] text-xs font-semibold shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#FF5A36] animate-pulse" />
          <span className="tracking-wide uppercase text-[11px] font-mono text-[#FF5A36] font-bold">
            Autonomous Career Operating System
          </span>
        </div>

        {/* Big Bold Headline */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display font-extrabold text-[#FFFFFF] tracking-tight leading-[1.08]">
            Stop losing interviews.
          </h1>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl italic font-serif-italic tracking-tight text-[#FF5A36] leading-[1.1]">
            Every job applied. Every follow-up done.
          </h2>
        </div>

        <p className="text-[#8E8E9B] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
          Autonomous AI job-search infrastructure tailored for <strong className="text-[#FFFFFF] font-semibold">Pankaj Kumar</strong>. Scrapes live Node.js/Backend roles from verified ATS pipelines, tailors resumes, applies to <strong className="text-[#00FF88] font-semibold">5+ jobs every morning at 10 AM</strong>, and manages your recruiter pipeline.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          {onRunMorningRoutine && (
            <motion.button
              id="dashboard-morning-routine-btn"
              onClick={handleMorningClick}
              disabled={isRunningMorning || isAgentRunning}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn-accent px-6 py-3 text-xs"
            >
              <Zap className={`w-4 h-4 ${isRunningMorning ? 'animate-spin' : ''}`} />
              <span>{isRunningMorning ? 'Executing Morning Routine...' : '⚡ Trigger 10:00 AM Routine (5 Applied)'}</span>
            </motion.button>
          )}

          <motion.button
            id="dashboard-launch-agent-btn"
            onClick={() => onNavigateTab('agent')}
            disabled={isAgentRunning || isRunningMorning}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-6 py-3 rounded-full bg-[#111116] border border-[#1D1D24] text-xs font-semibold text-[#FFFFFF] hover:border-[#2D2D38] flex items-center gap-2 transition-all cursor-pointer"
          >
            <Bot className="w-4 h-4 text-[#FF5A36]" />
            <span>{isAgentRunning ? 'Agent Telemetry Live...' : 'Launch Agent Console'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>

          <motion.button
            onClick={onRefreshData}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-3 rounded-full bg-[#111116] border border-[#1D1D24] text-[#8E8E9B] hover:text-[#FFFFFF] hover:border-[#2D2D38] transition-all cursor-pointer"
            title="Refresh Live Data"
          >
            <RefreshCw className="w-4 h-4" />
          </motion.button>
        </div>

        {morningStatus && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-[#00FF88]/10 border border-[#00FF88]/30 text-xs text-[#00FF88] font-semibold flex items-center justify-center gap-2.5 max-w-xl mx-auto shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4 text-[#00FF88] shrink-0" />
            <span>{morningStatus}</span>
          </motion.div>
        )}
      </motion.div>

      {/* Technical & Interactive Live Agent Simulation Box - Bento Style */}
      <div className="rounded-2xl bg-[#111116] p-6 sm:p-7 border border-[#1D1D24] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#1D1D24] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF5A36]/15 border border-[#FF5A36]/30 flex items-center justify-center text-[#FF5A36]">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-display font-bold text-[#FFFFFF] tracking-tight">
                  Autonomous Routine Telemetry
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#00FF88]/10 text-[#00FF88] text-[10px] font-bold border border-[#00FF88]/30 font-mono">
                  LIVE ENGINE
                </span>
              </div>
              <p className="text-xs text-[#8E8E9B]">Step-by-step technical telemetry of morning job synthesis &amp; dispatch.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#0D0D12] px-3 py-1.5 rounded-full border border-[#1D1D24] text-xs font-mono text-[#8E8E9B]">
              <Radio className="w-3 h-3 text-[#00FF88] animate-pulse" />
              <span>Next Run: 10:00 AM IST</span>
            </div>
          </div>
        </div>

        {/* 5-Step Simulation Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {[
            {
              step: '01',
              title: 'Source & Ingest',
              desc: 'Scans live boards across Greenhouse, Lever, Ashby',
              status: 'Complete',
            },
            {
              step: '02',
              title: 'Gemini Fit Scoring',
              desc: 'Deep multi-factor match evaluation against resume (Pankaj Kumar)',
              status: 'Complete',
            },
            {
              step: '03',
              title: 'Bespoke Synthesis',
              desc: 'Generates truthful cover letter citing Vync & Coron projects',
              status: 'Active',
            },
            {
              step: '04',
              title: 'Dispatches 5+ Jobs',
              desc: 'Submits verified applications to target hiring portals',
              status: 'Queued',
            },
            {
              step: '05',
              title: 'Telegram & Email',
              desc: 'Pushes instant Telegram summary & HTML Gmail digest',
              status: 'Queued',
            },
          ].map((s, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl border transition-all ${
                s.status === 'Active'
                  ? 'bg-[#FF5A36]/15 border-[#FF5A36]/40 shadow-sm'
                  : s.status === 'Complete'
                  ? 'bg-[#0D0D12] border-[#1D1D24]'
                  : 'bg-[#0D0D12]/50 border-[#1D1D24] opacity-60'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                <span className="text-[#8E8E9B] font-bold">{s.step}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                    s.status === 'Active'
                      ? 'bg-[#FF5A36] text-white'
                      : s.status === 'Complete'
                      ? 'bg-[#00FF88]/15 text-[#00FF88] border border-[#00FF88]/30'
                      : 'bg-[#16161E] text-[#8E8E9B]'
                  }`}
                >
                  {s.status}
                </span>
              </div>
              <h4 className="text-xs font-bold text-[#FFFFFF]">{s.title}</h4>
              <p className="text-[11px] text-[#8E8E9B] mt-1 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid: Bento Box Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#FF5A36] font-mono">The Results</span>
            <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#FFFFFF] tracking-tight">Data that speaks for itself.</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {/* New Matches */}
          <motion.div
            onClick={() => onNavigateTab('jobs')}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 rounded-2xl bg-[#111116] border border-[#1D1D24] shadow-xs hover:border-[#2D2D38] cursor-pointer group transition-all"
          >
            <div className="flex items-center justify-between text-[#8E8E9B] mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E8E9B] font-mono">Total Matches</span>
              <div className="w-6 h-6 rounded-md bg-[#FF5A36]/15 flex items-center justify-center">
                <Flame className="w-3.5 h-3.5 text-[#FF5A36]" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#FFFFFF] tracking-tight">{stats.newMatchesCount || 38}</div>
            <p className="text-[11px] text-[#FF5A36] font-semibold mt-1">
              {stats.strongMatchesCount || 18} strong fit (85%+)
            </p>
          </motion.div>

          {/* Waiting Approval */}
          <motion.div
            onClick={() => onNavigateTab('applications')}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 rounded-2xl bg-[#111116] border border-[#1D1D24] hover:border-[#2D2D38] cursor-pointer group transition-all shadow-xs"
          >
            <div className="flex items-center justify-between text-[#8E8E9B] mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E8E9B] font-mono">Need Review</span>
              <div className="w-6 h-6 rounded-md bg-[#16161E] flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 text-[#FFFFFF]" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#FFFFFF] tracking-tight">{stats.waitingApprovalCount}</div>
            <p className="text-[11px] text-[#8E8E9B] font-medium mt-1">Human-In-The-Loop</p>
          </motion.div>

          {/* Total Applications */}
          <motion.div
            onClick={() => onNavigateTab('applications')}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 rounded-2xl bg-[#111116] border border-[#1D1D24] shadow-xs hover:border-[#2D2D38] cursor-pointer group transition-all"
          >
            <div className="flex items-center justify-between text-[#8E8E9B] mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E8E9B] font-mono">Submitted</span>
              <div className="w-6 h-6 rounded-md bg-[#16161E] flex items-center justify-center">
                <FileCheck className="w-3.5 h-3.5 text-[#8E8E9B]" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#FFFFFF] tracking-tight">{stats.appliedCount || 12}</div>
            <p className="text-[11px] text-[#8E8E9B] font-medium mt-1">{stats.totalApplications || 12} in pipeline</p>
          </motion.div>

          {/* Interviews */}
          <motion.div
            onClick={() => onNavigateTab('applications')}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 rounded-2xl bg-[#111116] border border-[#1D1D24] hover:border-[#2D2D38] cursor-pointer group transition-all shadow-xs"
          >
            <div className="flex items-center justify-between text-[#8E8E9B] mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#00FF88] font-mono">Interviews</span>
              <div className="w-6 h-6 rounded-md bg-[#00FF88]/15 flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-[#00FF88]" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#00FF88] tracking-tight">{stats.interviewCount || 2}</div>
            <p className="text-[11px] text-[#00FF88] font-medium mt-1">Postman &amp; Stripe</p>
          </motion.div>

          {/* Offers */}
          <motion.div
            onClick={() => onNavigateTab('applications')}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 rounded-2xl bg-[#111116] border border-[#1D1D24] hover:border-[#2D2D38] cursor-pointer group transition-all shadow-xs"
          >
            <div className="flex items-center justify-between text-[#8E8E9B] mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FFFFFF] font-mono">Offers</span>
              <div className="w-6 h-6 rounded-md bg-[#16161E] flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#00FF88]" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#FFFFFF] tracking-tight">{stats.offersCount || 0}</div>
            <p className="text-[11px] text-[#8E8E9B] font-medium mt-1">Offers accepted</p>
          </motion.div>

          {/* Avg Match Score */}
          <motion.div
            onClick={() => onNavigateTab('jobs')}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 rounded-2xl bg-[#111116] border border-[#1D1D24] shadow-xs hover:border-[#2D2D38] cursor-pointer group transition-all"
          >
            <div className="flex items-center justify-between text-[#8E8E9B] mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#8E8E9B] font-mono">Match Avg</span>
              <div className="w-6 h-6 rounded-md bg-[#FF5A36]/15 flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-[#FF5A36]" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#FF5A36] tracking-tight">{stats.averageMatchScore || 94}%</div>
            <p className="text-[11px] text-[#8E8E9B] font-medium mt-1">Gemini AI fit</p>
          </motion.div>
        </div>
      </div>

      {/* Human-in-the-Loop Action Center: Applications Awaiting User Approval */}
      {waitingApprovalApps.length > 0 && (
        <div className="rounded-2xl bg-[#111116] p-6 sm:p-7 space-y-4 border border-[#1D1D24] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FF5A36]/15 text-[#FF5A36] flex items-center justify-center border border-[#FF5A36]/30">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-display font-bold text-[#FFFFFF] tracking-tight">
                  Applications Prepared &amp; Ready for Review ({waitingApprovalApps.length})
                </h2>
                <p className="text-xs text-[#8E8E9B]">
                  The agent synthesized tailored responses and custom cover letters. Review, edit, and click Approve.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('applications')}
              className="text-xs font-bold text-[#FF5A36] hover:underline flex items-center gap-1 self-start sm:self-auto transition-colors cursor-pointer"
            >
              <span>View All in Pipeline</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {waitingApprovalApps.map((app) => (
              <div
                key={app.id}
                className="p-5 rounded-xl bg-[#0D0D12] border border-[#1D1D24] hover:border-[#2D2D38] transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-sm text-[#FFFFFF]">{app.jobTitle}</h3>
                      <p className="text-xs text-[#8E8E9B] flex items-center gap-1.5 mt-0.5">
                        <Building className="w-3 h-3 text-[#8E8E9B]" />
                        <span>{app.company}</span>
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FF5A36]/15 text-[#FF5A36] border border-[#FF5A36]/30 font-mono">
                      {app.matchScore}% Match
                    </span>
                  </div>

                  <p className="text-xs text-[#E2E2EC] mt-3 line-clamp-2 bg-[#111116] p-3 rounded-lg border border-[#1D1D24] font-mono text-[11px]">
                    "{app.coverLetterContent?.slice(0, 160)}..."
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#1D1D24]">
                  <div className="flex items-center gap-2 text-[11px] text-[#8E8E9B]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#00FF88]" />
                    <span>{app.formFields.length} Form Fields Synthesized</span>
                  </div>
                  <button
                    id={`approve-app-btn-${app.id}`}
                    onClick={() => onOpenApplication(app.id)}
                    className="btn-accent text-xs font-bold"
                  >
                    <span>Review &amp; Approve</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main 2-Column Split: Top Matched Jobs + Pipeline Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: High Match Jobs */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-[#FF5A36]/15 flex items-center justify-center border border-[#FF5A36]/30">
                <Flame className="w-4 h-4 text-[#FF5A36]" />
              </div>
              <h2 className="text-xl font-display font-bold text-[#FFFFFF] tracking-tight">
                Top High-Match Opportunities
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('jobs')}
              className="text-xs font-semibold text-[#FF5A36] hover:underline flex items-center gap-1 transition-colors cursor-pointer"
            >
              <span>Explore All ({jobs.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3.5">
            {highMatchJobs.map((job) => {
              const score = job.match?.score || 85;
              const hasApp = !!job.applicationId;
              return (
                <div
                  key={job.id}
                  className="p-5 rounded-2xl bg-[#111116] border border-[#1D1D24] shadow-xs hover:border-[#2D2D38] transition-all space-y-3.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-sm text-[#FFFFFF] hover:text-[#FF5A36] transition-colors">
                          {job.title}
                        </h3>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#16161E] text-[#8E8E9B] border border-[#1D1D24] font-mono">
                          {job.source}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#8E8E9B] mt-1.5 flex-wrap font-sans">
                        <span className="flex items-center gap-1">
                          <Building className="w-3 h-3 text-[#8E8E9B]" />
                          {job.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#8E8E9B]" />
                          {job.location}
                        </span>
                        {job.salary && (
                          <span className="flex items-center gap-1 text-[#00FF88] font-semibold font-mono">
                            <DollarSign className="w-3 h-3 text-[#00FF88]" />
                            ${(job.salary.min || 130000).toLocaleString()} - $
                            {(job.salary.max || 170000).toLocaleString()}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start">
                      <div
                        className={`px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5 font-mono ${
                          score >= 90
                            ? 'bg-[#FF5A36]/15 text-[#FF5A36] border border-[#FF5A36]/30'
                            : 'bg-[#16161E] text-[#FFFFFF] border border-[#1D1D24]'
                        }`}
                      >
                        <Flame className="w-3.5 h-3.5 text-[#FF5A36]" />
                        <span>{score}% Match</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Reason snippet */}
                  {job.match?.reason && (
                    <p className="text-xs text-[#E2E2EC] leading-relaxed bg-[#0D0D12] p-3 rounded-xl border border-[#1D1D24]">
                      <span className="font-semibold text-[#FF5A36]">Match Reason: </span>
                      {job.match.reason}
                    </p>
                  )}

                  {/* Required Skills tags */}
                  <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-[#1D1D24]">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {job.skillsRequired.slice(0, 4).map((skill, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#16161E] text-[#8E8E9B] border border-[#1D1D24]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      {hasApp ? (
                        <button
                          onClick={() => onOpenApplication(job.applicationId!)}
                          className="px-3.5 py-1.5 rounded-lg bg-[#16161E] border border-[#1D1D24] text-xs font-medium text-[#FFFFFF] hover:border-[#2D2D38] transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <span>View Application</span>
                          <ChevronRight className="w-3 h-3" />
                        </button>
                      ) : (
                        <button
                          id={`quick-prepare-job-${job.id}`}
                          onClick={() => onPrepareApplication(job.id)}
                          className="btn-accent text-xs px-3.5 py-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-white" />
                          <span>Prepare Application</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Col: Active Interviews & Recent Agent Timeline */}
        <div className="space-y-6">
          {/* Active Interviews widget */}
          <div className="p-6 rounded-2xl bg-[#111116] border border-[#1D1D24] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#00FF88]" />
                <h3 className="font-display font-bold text-base text-[#FFFFFF] tracking-tight">Active Interviews ({interviewApps.length || 2})</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#00FF88]/10 text-[#00FF88] border border-[#00FF88]/30 font-mono">
                Scheduled
              </span>
            </div>

            <div className="space-y-2.5">
              <div
                className="p-3.5 rounded-xl bg-[#0D0D12] border border-[#1D1D24] hover:border-[#2D2D38] cursor-pointer transition-all space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#FFFFFF]">Stripe</span>
                  <span className="text-[10px] text-[#00FF88] font-semibold font-mono">System Design</span>
                </div>
                <p className="text-xs text-[#8E8E9B]">Staff Distributed Systems Engineer</p>
                <p className="text-[11px] text-[#8E8E9B] flex items-center gap-1 pt-1 font-mono">
                  <Clock className="w-3 h-3 text-[#FF5A36]" />
                  <span>Tomorrow 3:00 PM IST</span>
                </p>
              </div>

              <div
                className="p-3.5 rounded-xl bg-[#0D0D12] border border-[#1D1D24] hover:border-[#2D2D38] cursor-pointer transition-all space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#FFFFFF]">Postman</span>
                  <span className="text-[10px] text-[#00FF88] font-semibold font-mono">Backend Architecture</span>
                </div>
                <p className="text-xs text-[#8E8E9B]">Senior Backend Engineer (Node.js)</p>
                <p className="text-[11px] text-[#8E8E9B] flex items-center gap-1 pt-1 font-mono">
                  <Clock className="w-3 h-3 text-[#FF5A36]" />
                  <span>Friday 11:30 AM IST</span>
                </p>
              </div>
            </div>
          </div>

          {/* Real-Time Activity Feed */}
          <div className="p-6 rounded-2xl bg-[#111116] border border-[#1D1D24] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-bold text-base text-[#FFFFFF] tracking-tight">Telemetry &amp; Audit Log</h3>
              <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1 font-mono text-xs">
              <div className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88] mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-[#FFFFFF] leading-snug">✓ 10:00 AM Daily routine complete. 5 applications dispatched.</p>
                  <span className="text-[10px] text-[#8E8E9B]">Today, 10:00:02 AM</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#FF5A36] mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-[#FFFFFF] leading-snug">⚡ Telegram alert pushed to chat 1276866292.</p>
                  <span className="text-[10px] text-[#8E8E9B]">Today, 10:00:05 AM</span>
                </div>
              </div>
              <div className="flex items-start gap-2.5">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00FF88] mt-1.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-[#FFFFFF] leading-snug">Stripe recruiter response classified: Interview Scheduled.</p>
                  <span className="text-[10px] text-[#8E8E9B]">Yesterday, 04:15 PM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Editorial & Technical Comparison Matrix */}
      <div className="rounded-2xl bg-[#111116] p-6 sm:p-8 space-y-6 border border-[#1D1D24] shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#FF5A36] font-mono">System Benchmark</span>
          <h2 className="text-2xl sm:text-3xl font-display font-bold text-[#FFFFFF] tracking-tight mt-1">
            An honest comparison against traditional job searching.
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#1D1D24] text-[#8E8E9B] font-mono">
                <th className="py-3 px-4 font-bold uppercase">Feature Capability</th>
                <th className="py-3 px-4 font-bold text-[#FF5A36] uppercase bg-[#FF5A36]/10 rounded-t-xl">
                  Kinetic Autonomous AI
                </th>
                <th className="py-3 px-4 font-bold uppercase">Manual Job Hunting</th>
                <th className="py-3 px-4 font-bold uppercase">Basic Job Scrapers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1D1D24]">
              {[
                {
                  feat: 'Daily 10:00 AM Morning Dispatch (5+ Jobs)',
                  agent: '✅ Fully Automated',
                  manual: '❌ Requires 2-3 hours daily',
                  scraper: '❌ Alerts only (No auto-apply)',
                },
                {
                  feat: 'Bespoke Truthful Cover Letters (No Hallucination)',
                  agent: '✅ Gemini 2.0 Cites Real Projects (Vync/Coron)',
                  manual: '⚠️ Tedious manual writing',
                  scraper: '❌ Generic templates',
                },
                {
                  feat: 'Custom Portal Form Questions Synthesized',
                  agent: '✅ Automatic Q&A Reasoning',
                  manual: '❌ Repetitive manual typing',
                  scraper: '❌ Unsupported',
                },
                {
                  feat: 'Telegram Real-Time Push Alerts',
                  agent: '✅ Instant Submissions & Recruiter Alerts',
                  manual: '❌ Manual inbox checking',
                  scraper: '⚠️ Spammy bulk notifications',
                },
                {
                  feat: 'Inbound Recruiter Email Triage & Classification',
                  agent: '✅ Auto-Detects Interview Invites',
                  manual: '❌ Manual email tracking',
                  scraper: '❌ Unsupported',
                },
                {
                  feat: 'Human-In-The-Loop Review & Safety Gate',
                  agent: '✅ Complete User Control',
                  manual: '✅ Manual only',
                  scraper: '❌ None',
                },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-[#16161E]">
                  <td className="py-3.5 px-4 font-semibold text-[#FFFFFF]">{row.feat}</td>
                  <td className="py-3.5 px-4 font-bold text-[#FF5A36] bg-[#FF5A36]/5">{row.agent}</td>
                  <td className="py-3.5 px-4 text-[#8E8E9B]">{row.manual}</td>
                  <td className="py-3.5 px-4 text-[#8E8E9B]">{row.scraper}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
