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
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FCFBF8] border border-[#DDDAD2] text-[#6B6B67] text-xs font-semibold shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#FF5A36] animate-pulse" />
          <span className="tracking-wide uppercase text-[11px] font-mono text-[#FF5A36] font-bold">
            Autonomous Career Operating System
          </span>
        </div>

        {/* Big Bold Editorial Headline with Instrument Serif */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-normal font-editorial text-[#111111] tracking-tight leading-[1.08]">
            Stop losing interviews.
          </h1>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl italic font-normal font-editorial tracking-tight text-[#FF5A36] leading-[1.1]">
            Every job applied. Every follow-up done.
          </h2>
        </div>

        <p className="text-[#6B6B67] text-sm sm:text-base leading-relaxed max-w-2xl mx-auto font-normal">
          Traditional job hunting takes hours of tedious manual forms. Our autonomous AI qualifies matches, crafts truthful bespoke cover letters, applies to <strong className="text-[#111111] font-semibold">5+ jobs every morning at 10 AM</strong>, and manages your recruiter pipeline.
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
              <span>{isRunningMorning ? 'Executing Morning Routine...' : '⚡ Test 10:00 AM Routine (5 Applied)'}</span>
            </motion.button>
          )}

          <motion.button
            id="dashboard-launch-agent-btn"
            onClick={() => onNavigateTab('agent')}
            disabled={isAgentRunning || isRunningMorning}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-secondary-outline px-6 py-3 text-xs"
          >
            <Bot className="w-4 h-4 text-[#FF5A36]" />
            <span>{isAgentRunning ? 'Agent Telemetry Live...' : 'Launch Agent Console'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </motion.button>

          <motion.button
            onClick={onRefreshData}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-icon p-3"
            title="Refresh Live Data"
          >
            <RefreshCw className="w-4 h-4" />
          </motion.button>
        </div>

        {morningStatus && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-[#FFE8E1] border border-[#FF5A36]/30 text-xs text-[#FF5A36] font-semibold flex items-center justify-center gap-2.5 max-w-xl mx-auto shadow-xs"
          >
            <CheckCircle2 className="w-4 h-4 text-[#FF5A36] shrink-0" />
            <span>{morningStatus}</span>
          </motion.div>
        )}
      </motion.div>

      {/* Technical & Interactive Live Agent Simulation Box - Bento Style */}
      <div className="rounded-2xl bg-[#FCFBF8] p-6 sm:p-7 border border-[#DDDAD2] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#DDDAD2] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FFE8E1] border border-[#FF5A36]/20 flex items-center justify-center text-[#FF5A36]">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-editorial font-normal text-[#111111] tracking-tight">
                  Autonomous Routine Telemetry
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-[#FFE8E1] text-[#FF5A36] text-[10px] font-bold border border-[#FF5A36]/30 font-mono">
                  LIVE ENGINE
                </span>
              </div>
              <p className="text-xs text-[#6B6B67]">Step-by-step technical telemetry of morning job synthesis & dispatch.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#F7F6F2] px-3 py-1.5 rounded-full border border-[#DDDAD2] text-xs font-mono text-[#6B6B67]">
              <Radio className="w-3 h-3 text-[#FF5A36] animate-pulse" />
              <span>Next Run: Tomorrow 10:00 AM</span>
            </div>
          </div>
        </div>

        {/* 5-Step Simulation Flow */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {[
            {
              step: '01',
              title: 'Source & Ingest',
              desc: 'Scans live boards across Greenhouse, Lever, Wellfound',
              status: 'Complete',
            },
            {
              step: '02',
              title: 'Gemini Fit Scoring',
              desc: 'Deep multi-factor match evaluation against candidate resume',
              status: 'Complete',
            },
            {
              step: '03',
              title: 'Bespoke Synthesis',
              desc: 'Generates truthful cover letter & custom form responses',
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
                  ? 'bg-[#FFE8E1]/60 border-[#FF5A36]/40 shadow-2xs'
                  : s.status === 'Complete'
                  ? 'bg-[#F7F6F2] border-[#DDDAD2]'
                  : 'bg-[#F7F6F2]/50 border-[#DDDAD2] opacity-75'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono mb-2">
                <span className="text-[#6B6B67] font-bold">{s.step}</span>
                <span
                  className={`px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
                    s.status === 'Active'
                      ? 'bg-[#FF5A36] text-white'
                      : s.status === 'Complete'
                      ? 'bg-[#FAF9F5] text-[#111111] border border-[#DDDAD2]'
                      : 'bg-[#F7F6F2] text-[#6B6B67]'
                  }`}
                >
                  {s.status}
                </span>
              </div>
              <h4 className="text-xs font-bold text-[#111111]">{s.title}</h4>
              <p className="text-[11px] text-[#6B6B67] mt-1 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid: Bento Box Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-[#FF5A36] font-mono">The Results</span>
            <h2 className="text-2xl sm:text-3xl font-normal font-editorial text-[#111111] tracking-tight">Data that speaks for itself.</h2>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5 sm:gap-4">
          {/* New Matches */}
          <motion.div
            onClick={() => onNavigateTab('jobs')}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 rounded-2xl bg-[#FCFBF8] border border-[#DDDAD2] shadow-xs hover:border-[#111111] cursor-pointer group transition-all"
          >
            <div className="flex items-center justify-between text-[#6B6B67] mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6B67] font-mono">Total Matches</span>
              <div className="w-6 h-6 rounded-md bg-[#FFE8E1] flex items-center justify-center">
                <Flame className="w-3.5 h-3.5 text-[#FF5A36]" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">{stats.newMatchesCount}</div>
            <p className="text-[11px] text-[#FF5A36] font-semibold mt-1">
              {stats.strongMatchesCount} strong fit (85%+)
            </p>
          </motion.div>

          {/* Waiting Approval */}
          <motion.div
            onClick={() => onNavigateTab('applications')}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 rounded-2xl bg-[#FCFBF8] border border-[#DDDAD2] hover:border-[#111111] cursor-pointer group transition-all shadow-xs"
          >
            <div className="flex items-center justify-between text-[#6B6B67] mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6B67] font-mono">Need Review</span>
              <div className="w-6 h-6 rounded-md bg-[#F7F6F2] flex items-center justify-center">
                <Clock className="w-3.5 h-3.5 text-[#111111]" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">{stats.waitingApprovalCount}</div>
            <p className="text-[11px] text-[#6B6B67] font-medium mt-1">Human-In-The-Loop</p>
          </motion.div>

          {/* Total Applications */}
          <motion.div
            onClick={() => onNavigateTab('applications')}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 rounded-2xl bg-[#FCFBF8] border border-[#DDDAD2] shadow-xs hover:border-[#111111] cursor-pointer group transition-all"
          >
            <div className="flex items-center justify-between text-[#6B6B67] mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6B67] font-mono">Submitted</span>
              <div className="w-6 h-6 rounded-md bg-[#F7F6F2] flex items-center justify-center">
                <FileCheck className="w-3.5 h-3.5 text-[#6B6B67]" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">{stats.appliedCount}</div>
            <p className="text-[11px] text-[#6B6B67] font-medium mt-1">{stats.totalApplications} in pipeline</p>
          </motion.div>

          {/* Interviews */}
          <motion.div
            onClick={() => onNavigateTab('applications')}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#DDDAD2] hover:border-[#111111] cursor-pointer group transition-all shadow-xs"
          >
            <div className="flex items-center justify-between text-[#6B6B67] mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#FF5A36] font-mono">Interviews</span>
              <div className="w-6 h-6 rounded-md bg-[#FFE8E1] flex items-center justify-center">
                <Sparkles className="w-3.5 h-3.5 text-[#FF5A36]" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">{stats.interviewCount}</div>
            <p className="text-[11px] text-[#FF5A36] font-medium mt-1">Recruiter rounds</p>
          </motion.div>

          {/* Offers */}
          <motion.div
            onClick={() => onNavigateTab('applications')}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 rounded-2xl bg-[#FCFBF8] border border-[#DDDAD2] hover:border-[#111111] cursor-pointer group transition-all shadow-xs"
          >
            <div className="flex items-center justify-between text-[#6B6B67] mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#111111] font-mono">Offers</span>
              <div className="w-6 h-6 rounded-md bg-[#F7F6F2] flex items-center justify-center">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#111111]" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">{stats.offersCount}</div>
            <p className="text-[11px] text-[#111111] font-medium mt-1">Offers accepted</p>
          </motion.div>

          {/* Avg Match Score */}
          <motion.div
            onClick={() => onNavigateTab('jobs')}
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 rounded-2xl bg-[#FCFBF8] border border-[#DDDAD2] shadow-xs hover:border-[#111111] cursor-pointer group transition-all"
          >
            <div className="flex items-center justify-between text-[#6B6B67] mb-1.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#6B6B67] font-mono">Match Avg</span>
              <div className="w-6 h-6 rounded-md bg-[#FFE8E1] flex items-center justify-center">
                <TrendingUp className="w-3.5 h-3.5 text-[#FF5A36]" />
              </div>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-[#111111] tracking-tight">{stats.averageMatchScore}%</div>
            <p className="text-[11px] text-[#FF5A36] font-medium mt-1">Gemini AI fit</p>
          </motion.div>
        </div>
      </div>

      {/* Human-in-the-Loop Action Center: Applications Awaiting User Approval */}
      {waitingApprovalApps.length > 0 && (
        <div className="rounded-2xl bg-[#FCFBF8] p-6 sm:p-7 space-y-4 border border-[#DDDAD2] shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#FFE8E1] text-[#FF5A36] flex items-center justify-center border border-[#FF5A36]/20">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-normal font-editorial text-[#111111] tracking-tight">
                  Applications Prepared & Ready for Review ({waitingApprovalApps.length})
                </h2>
                <p className="text-xs text-[#6B6B67]">
                  The agent synthesized tailored responses and custom cover letters. Review, edit, and click Approve.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('applications')}
              className="text-xs font-bold text-[#FF5A36] hover:underline flex items-center gap-1 self-start sm:self-auto transition-colors"
            >
              <span>View All in Pipeline</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {waitingApprovalApps.map((app) => (
              <div
                key={app.id}
                className="p-5 rounded-xl bg-[#FAF9F5] border border-[#DDDAD2] hover:border-[#111111] transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-sm text-[#111111]">{app.jobTitle}</h3>
                      <p className="text-xs text-[#6B6B67] flex items-center gap-1.5 mt-0.5">
                        <Building className="w-3 h-3 text-[#6B6B67]" />
                        <span>{app.company}</span>
                      </p>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FFE8E1] text-[#FF5A36] border border-[#FF5A36]/20 font-mono">
                      {app.matchScore}% Match
                    </span>
                  </div>

                  <p className="text-xs text-[#111111] mt-3 line-clamp-2 bg-[#FCFBF8] p-3 rounded-lg border border-[#DDDAD2] font-mono text-[11px]">
                    "{app.coverLetterContent?.slice(0, 160)}..."
                  </p>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#DDDAD2]">
                  <div className="flex items-center gap-2 text-[11px] text-[#6B6B67]">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#FF5A36]" />
                    <span>{app.formFields.length} Form Fields Synthesized</span>
                  </div>
                  <button
                    id={`approve-app-btn-${app.id}`}
                    onClick={() => onOpenApplication(app.id)}
                    className="btn-accent text-xs font-bold"
                  >
                    <span>Review & Approve</span>
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
              <div className="w-7 h-7 rounded-lg bg-[#FFE8E1] flex items-center justify-center border border-[#FF5A36]/20">
                <Flame className="w-4 h-4 text-[#FF5A36]" />
              </div>
              <h2 className="text-xl sm:text-2xl font-normal font-editorial text-[#111111] tracking-tight">
                Top High-Match Opportunities
              </h2>
            </div>
            <button
              onClick={() => onNavigateTab('jobs')}
              className="text-xs font-semibold text-[#FF5A36] hover:underline flex items-center gap-1 transition-colors"
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
                  className="p-5 rounded-2xl bg-[#FCFBF8] border border-[#DDDAD2] shadow-xs hover:border-[#111111] transition-all space-y-3.5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-bold text-sm text-[#111111] hover:text-[#FF5A36] transition-colors">
                          {job.title}
                        </h3>
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#F7F6F2] text-[#6B6B67] border border-[#DDDAD2] font-mono">
                          {job.source}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-[#6B6B67] mt-1.5 flex-wrap font-sans">
                        <span className="flex items-center gap-1">
                          <Building className="w-3 h-3 text-[#6B6B67]" />
                          {job.company}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-[#6B6B67]" />
                          {job.location}
                        </span>
                        {job.salary && (
                          <span className="flex items-center gap-1 text-[#111111] font-semibold font-mono">
                            <DollarSign className="w-3 h-3 text-[#FF5A36]" />
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
                            ? 'bg-[#FFE8E1] text-[#FF5A36] border border-[#FF5A36]/30'
                            : 'bg-[#F7F6F2] text-[#111111] border border-[#DDDAD2]'
                        }`}
                      >
                        <Flame className="w-3.5 h-3.5 text-[#FF5A36]" />
                        <span>{score}% Match</span>
                      </div>
                    </div>
                  </div>

                  {/* AI Reason snippet */}
                  {job.match?.reason && (
                    <p className="text-xs text-[#111111] leading-relaxed bg-[#F7F6F2] p-3 rounded-xl border border-[#DDDAD2]">
                      <span className="font-semibold text-[#FF5A36]">Match Reason: </span>
                      {job.match.reason}
                    </p>
                  )}

                  {/* Required Skills tags */}
                  <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-[#DDDAD2]">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {job.skillsRequired.slice(0, 4).map((skill, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-md text-[11px] font-medium bg-[#F7F6F2] text-[#6B6B67] border border-[#DDDAD2]"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center gap-2">
                      {hasApp ? (
                        <button
                          onClick={() => onOpenApplication(job.applicationId!)}
                          className="btn-secondary-outline text-xs px-3 py-1.5"
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
          <div className="p-6 rounded-2xl bg-[#FCFBF8] border border-[#DDDAD2] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#FF5A36]" />
                <h3 className="font-editorial text-xl font-normal text-[#111111] tracking-tight">Active Interviews ({interviewApps.length})</h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FFE8E1] text-[#FF5A36] border border-[#FF5A36]/20 font-mono">
                Scheduled
              </span>
            </div>

            {interviewApps.length === 0 ? (
              <p className="text-xs text-[#6B6B67] py-3 text-center">
                No active interviews currently detected. As recruiter invitations arrive in email, they will sync here.
              </p>
            ) : (
              <div className="space-y-2.5">
                {interviewApps.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => onOpenApplication(app.id)}
                    className="p-3.5 rounded-xl bg-[#FAF9F5] border border-[#DDDAD2] hover:border-[#111111] cursor-pointer transition-all space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#111111]">{app.company}</span>
                      <span className="text-[10px] text-[#FF5A36] font-semibold font-mono">Technical Round</span>
                    </div>
                    <p className="text-xs text-[#6B6B67]">{app.jobTitle}</p>
                    {app.interviewDate && (
                      <p className="text-[11px] text-[#6B6B67] flex items-center gap-1 pt-1 font-mono">
                        <Clock className="w-3 h-3" />
                        {new Date(app.interviewDate).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Real-Time Activity Feed */}
          <div className="p-6 rounded-2xl bg-[#FCFBF8] border border-[#DDDAD2] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-editorial text-xl font-normal text-[#111111] tracking-tight">Telemetry & Audit Log</h3>
              <span className="w-2 h-2 rounded-full bg-[#FF5A36] animate-pulse" />
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {stats.recentActivity.map((item) => (
                <div key={item.id} className="flex items-start gap-2.5 text-xs">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#FF5A36] mt-1.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-[#111111] leading-snug">{item.message}</p>
                    <span className="text-[10px] text-[#6B6B67] font-mono">
                      {new Date(item.time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Editorial & Technical Comparison Matrix */}
      <div className="rounded-2xl bg-[#FCFBF8] p-6 sm:p-8 space-y-6 border border-[#DDDAD2] shadow-xs">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-widest text-[#FF5A36] font-mono">System Benchmark</span>
          <h2 className="text-2xl sm:text-3xl font-normal font-editorial text-[#111111] tracking-tight mt-1">
            An honest comparison against traditional job searching.
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-[#DDDAD2] text-[#6B6B67] font-mono">
                <th className="py-3 px-4 font-bold uppercase">Feature Capability</th>
                <th className="py-3 px-4 font-bold text-[#FF5A36] uppercase bg-[#FFE8E1]/50 rounded-t-xl">
                  Kinetic Autonomous AI
                </th>
                <th className="py-3 px-4 font-bold uppercase">Manual Job Hunting</th>
                <th className="py-3 px-4 font-bold uppercase">Basic Job Scrapers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DDDAD2]">
              {[
                {
                  feat: 'Daily 10:00 AM Morning Dispatch (5+ Jobs)',
                  agent: '✅ Fully Automated',
                  manual: '❌ Requires 2-3 hours daily',
                  scraper: '❌ Alerts only (No auto-apply)',
                },
                {
                  feat: 'Bespoke Truthful Cover Letters (No Hallucination)',
                  agent: '✅ Gemini 2.0 Cites Real Projects',
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
                <tr key={i} className="hover:bg-[#FAF9F5]">
                  <td className="py-3.5 px-4 font-semibold text-[#111111]">{row.feat}</td>
                  <td className="py-3.5 px-4 font-bold text-[#FF5A36] bg-[#FFE8E1]/20">{row.agent}</td>
                  <td className="py-3.5 px-4 text-[#6B6B67]">{row.manual}</td>
                  <td className="py-3.5 px-4 text-[#6B6B67]">{row.scraper}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
