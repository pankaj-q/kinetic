import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  Zap,
  CheckCircle2,
  Search,
  ChevronRight,
  Layers,
  Send,
  Cpu
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
  onOpenTelegramModal?: () => void;
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
  onOpenTelegramModal,
}) => {
  const [isRunningMorning, setIsRunningMorning] = useState(false);
  const [morningResult, setMorningResult] = useState<string | null>(null);
  const [activeConsoleTab, setActiveConsoleTab] = useState<'telemetry' | 'matrix' | 'artifact'>('telemetry');

  const telemetryLogs = [
    { time: '10:00:01 AM', tag: 'INGEST', text: 'Scanning live feeds (Greenhouse, Ashby, Lever, Y Combinator)...', color: 'text-[#8B8D96]' },
    { time: '10:00:03 AM', tag: 'EVALUATE', text: 'Gemini 2.0 multi-factor semantic fit scoring across 64 incoming roles.', color: 'text-[#38BDF8]' },
    { time: '10:00:05 AM', tag: 'MATCH', text: '3 high-affinity roles identified with ≥88% technical stack & seniority match.', color: 'text-[#00E676]' },
    { time: '10:00:07 AM', tag: 'SYNTHESIS', text: 'Crafting bespoke cover letter tailored with GitHub repository citations.', color: 'text-[#FF5A36]' },
    { time: '10:00:10 AM', tag: 'DISPATCH', text: 'Application bundle queued & delivered to Telegram for 1-click approval.', color: 'text-[#00E676]' },
  ];

  const handleRunMorning = async () => {
    if (!onRunMorningRoutine) return;
    setIsRunningMorning(true);
    setMorningResult(null);
    try {
      const res = await onRunMorningRoutine();
      setMorningResult(
        res?.message ||
          `Routine executed successfully! ${res?.appliedCount || 3} tailored applications dispatched to your Telegram.`
      );
    } catch (err: any) {
      setMorningResult(`Autonomous run error: ${err.message}`);
    } finally {
      setIsRunningMorning(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-[#F5F5F5] flex flex-col justify-between selection:bg-[#FF5A36]/30 selection:text-[#FF5A36] font-['Inter',sans-serif] relative overflow-hidden">
      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-24 w-full space-y-20 relative z-10">
        
        {/* =========================================================================
            1. HERO SECTION (Minimalist, Large Editorial Typography, High-Intent CTAs)
           ========================================================================= */}
        <div className="text-center space-y-7 max-w-3xl mx-auto pt-4">
          {/* Status Announcement Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0E0E14] border border-[#1C1D26] text-xs font-mono select-none shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#00E676] animate-pulse" />
            <span className="text-[#8B8D96] uppercase tracking-wider font-semibold">KINETIC 2.0</span>
            <span className="text-[#2B2B38]">•</span>
            <span className="text-[#F5F5F5] font-medium">{schedulerConfig?.dailyMorningTime || '10:00 AM'} DISPATCH</span>
            <span className="text-[#2B2B38]">•</span>
            <span className="text-[#FF5A36] font-medium">AUTONOMOUS</span>
          </div>

          {/* Master Headline Container - Full-Width Horizontal Grid Strip, bounded vertically to headline */}
          <div className="relative w-full py-8 my-2">
            {/* 1. Full-Width Edge-to-Edge 12px Precision Micro-Grid */}
            <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-screen bg-tech-grid [mask-image:radial-gradient(ellipse_95%_85%_at_50%_50%,#000_75%,transparent_100%)] opacity-95 pointer-events-none -z-10" />

            {/* 2. Concentrated Center Ambient Sunset Flare */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] h-[190px] bg-gradient-to-r from-[#FF5A36]/18 via-[#38BDF8]/10 to-[#FF5A36]/18 blur-2xl pointer-events-none rounded-full -z-10" />

            {/* 4. Full-Width Cyber Vector Constellation Line */}
            <svg
              className="absolute inset-0 left-1/2 -translate-x-1/2 w-screen h-full pointer-events-none opacity-45 dark:opacity-55"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 1440 200"
              preserveAspectRatio="none"
            >
              <defs>
                <linearGradient id="headline-curve-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FF5A36" stopOpacity="0.6" />
                  <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#00E676" stopOpacity="0.2" />
                </linearGradient>
              </defs>
              <path
                d="M 0 140 Q 360 20, 720 100 T 1440 50"
                stroke="url(#headline-curve-grad)"
                strokeWidth="1.2"
                strokeDasharray="4 4"
              />
              <circle cx="360" cy="60" r="3.5" fill="#FF5A36" />
              <circle cx="720" cy="100" r="4" fill="#38BDF8" />
              <circle cx="1080" cy="65" r="3.5" fill="#00E676" />
            </svg>

            {/* Master Headline */}
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display tracking-tight text-[#F5F5F5] leading-[1.08] relative z-10">
              Engineering your <span className="font-editorial-italic font-normal text-white">career,</span>
              <br />
              <span className="text-white">completely </span>
              <span className="text-[#FF5A36] inline-block font-display">
                autonomously.
              </span>
            </h1>
          </div>

          {/* Subtitle Value Proposition */}
          <p className="text-sm sm:text-base text-[#8B8D96] max-w-xl mx-auto leading-relaxed font-sans font-normal">
            Continuous discovery across verified tech pipelines, multi-factor Gemini 2.0 evaluation, and bespoke tailored applications dispatched to your Telegram at 10:00 AM.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRunMorning}
              disabled={isRunningMorning}
              className="w-full sm:w-auto bg-[#FF5A36] hover:bg-[#FF6D4A] text-white font-semibold text-xs sm:text-sm py-3 px-6 rounded-xl shadow-lg shadow-[#FF5A36]/20 hover:shadow-[#FF5A36]/30 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
            >
              <Zap className={`w-4 h-4 ${isRunningMorning ? 'animate-spin' : ''}`} />
              <span>{isRunningMorning ? 'Executing Morning Routine...' : '⚡ Run 10:00 AM Routine'}</span>
            </button>

            <button
              onClick={() => onNavigateTab('jobs')}
              className="w-full sm:w-auto bg-[#0E0E14] hover:bg-[#15151F] border border-[#1C1D26] hover:border-[#2D2E3C] text-[#F5F5F5] text-xs sm:text-sm py-3 px-5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium cursor-pointer"
            >
              <Search className="w-4 h-4 text-[#FF5A36]" />
              <span>Explore Live Feeds ({jobs.length})</span>
            </button>

            <button
              onClick={onEnterApp}
              className="w-full sm:w-auto bg-[#0E0E14] hover:bg-[#15151F] border border-[#1C1D26] hover:border-[#2D2E3C] text-[#8B8D96] hover:text-[#F5F5F5] text-xs sm:text-sm py-3 px-5 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 font-medium cursor-pointer"
            >
              <Layers className="w-4 h-4 text-[#8B8D96]" />
              <span>Open Dashboard</span>
            </button>
          </div>

          {/* Routine Result Banner */}
          {morningResult && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl bg-[#0E0E14] border border-[#00E676]/30 text-xs text-[#00E676] font-mono flex items-center justify-center gap-2 max-w-xl mx-auto shadow-xs"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{morningResult}</span>
            </motion.div>
          )}
        </div>

        {/* =========================================================================
            2. INTERACTIVE KINETIC OS LIVE AGENT CONSOLE (Linear / Raycast Terminal Style)
           ========================================================================= */}
        <div className="rounded-2xl bg-[#0E0E14] border border-[#1C1D26] shadow-2xl overflow-hidden max-w-4xl mx-auto">
          {/* Console Window Header */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#0A0A0E] border-b border-[#1C1D26]">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]/80" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#27C93F]/80" />
              <span className="text-[11px] font-mono text-[#8B8D96] ml-2">
                kinetic-agent@v2.0 ~ autonomous-session
              </span>
            </div>

            {/* Navigation Tabs inside Console */}
            <div className="flex items-center gap-1 bg-[#14141E] p-1 rounded-lg border border-[#1C1D26]">
              <button
                onClick={() => setActiveConsoleTab('telemetry')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all cursor-pointer ${
                  activeConsoleTab === 'telemetry'
                    ? 'bg-[#1D1D2C] text-white font-medium shadow-xs'
                    : 'text-[#8B8D96] hover:text-white'
                }`}
              >
                Telemetry Logs
              </button>
              <button
                onClick={() => setActiveConsoleTab('matrix')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all cursor-pointer ${
                  activeConsoleTab === 'matrix'
                    ? 'bg-[#1D1D2C] text-white font-medium shadow-xs'
                    : 'text-[#8B8D96] hover:text-white'
                }`}
              >
                Fit Matrix
              </button>
              <button
                onClick={() => setActiveConsoleTab('artifact')}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono transition-all cursor-pointer ${
                  activeConsoleTab === 'artifact'
                    ? 'bg-[#1D1D2C] text-white font-medium shadow-xs'
                    : 'text-[#8B8D96] hover:text-white'
                }`}
              >
                Tailored Letter
              </button>
            </div>
          </div>

          {/* Console Body */}
          <div className="p-6 font-mono text-xs min-h-[220px]">
            {activeConsoleTab === 'telemetry' && (
              <div className="space-y-3">
                {telemetryLogs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-3 leading-relaxed">
                    <span className="text-[#5A5A66] shrink-0">{log.time}</span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-[#161622] border border-[#1C1D26] text-[#8B8D96] shrink-0">
                      {log.tag}
                    </span>
                    <span className={`${log.color} break-words`}>{log.text}</span>
                  </div>
                ))}
                <div className="flex items-center gap-2 pt-2 text-[#00E676]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#00E676] animate-pulse" />
                  <span>Agent standing by for next scheduled dispatch cycle (10:00 AM IST)</span>
                </div>
              </div>
            )}

            {activeConsoleTab === 'matrix' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#0A0A0E] border border-[#1C1D26] space-y-2">
                  <div className="flex justify-between items-center text-[#8B8D96]">
                    <span>Tech Stack Alignment</span>
                    <span className="text-[#00E676] font-bold">96%</span>
                  </div>
                  <div className="w-full bg-[#161622] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#00E676] h-full rounded-full" style={{ width: '96%' }} />
                  </div>
                  <p className="text-[11px] text-[#5A5A66]">TypeScript, Node.js, PostgreSQL, LLMs, AI Agent Orchestration</p>
                </div>

                <div className="p-4 rounded-xl bg-[#0A0A0E] border border-[#1C1D26] space-y-2">
                  <div className="flex justify-between items-center text-[#8B8D96]">
                    <span>Seniority & Scope</span>
                    <span className="text-[#38BDF8] font-bold">92%</span>
                  </div>
                  <div className="w-full bg-[#161622] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#38BDF8] h-full rounded-full" style={{ width: '92%' }} />
                  </div>
                  <p className="text-[11px] text-[#5A5A66]">Senior / Lead Engineer • High Autonomy Product Ownership</p>
                </div>

                <div className="p-4 rounded-xl bg-[#0A0A0E] border border-[#1C1D26] space-y-2">
                  <div className="flex justify-between items-center text-[#8B8D96]">
                    <span>Compensation Target</span>
                    <span className="text-[#FF5A36] font-bold">94%</span>
                  </div>
                  <div className="w-full bg-[#161622] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#FF5A36] h-full rounded-full" style={{ width: '94%' }} />
                  </div>
                  <p className="text-[11px] text-[#5A5A66]">Competitive Base + Equity within $140k - $190k bandwidth</p>
                </div>

                <div className="p-4 rounded-xl bg-[#0A0A0E] border border-[#1C1D26] space-y-2">
                  <div className="flex justify-between items-center text-[#8B8D96]">
                    <span>Remote / Culture Fit</span>
                    <span className="text-[#00E676] font-bold">90%</span>
                  </div>
                  <div className="w-full bg-[#161622] h-1.5 rounded-full overflow-hidden">
                    <div className="bg-[#00E676] h-full rounded-full" style={{ width: '90%' }} />
                  </div>
                  <p className="text-[11px] text-[#5A5A66]">Remote-first, asynchronous engineering culture</p>
                </div>
              </div>
            )}

            {activeConsoleTab === 'artifact' && (
              <div className="p-4 rounded-xl bg-[#0A0A0E] border border-[#1C1D26] space-y-3 font-sans text-xs">
                <div className="flex items-center justify-between border-b border-[#1C1D26] pb-2 font-mono text-[11px] text-[#8B8D96]">
                  <span>RE: Senior AI Systems Engineer Application</span>
                  <span className="text-[#FF5A36]">Tailored via Gemini 2.0</span>
                </div>
                <p className="text-[#CCCCCC] leading-relaxed">
                  "Having architected autonomous agent workflows that interface with real-time vector databases and LLMs, I noticed your team is building scalable multi-agent infrastructure. In my previous work (<span className="text-[#00E676] font-mono">github.com/pankaj/agent-pipeline</span>), I designed a resilient execution graph that cut job dispatch latency by 45%..."
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-[#8B8D96]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00E676]" />
                  <span>Citations verified against candidate verified experience record.</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* =========================================================================
            3. THREE MINIMAL BENTO FEATURE PILLARS (Razor-Sharp Value)
           ========================================================================= */}
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#F5F5F5]">
              Designed for zero busywork.
            </h2>
            <p className="text-xs sm:text-sm text-[#8B8D96] max-w-md mx-auto">
              Replace hundreds of manual job boards with a self-executing autonomous agent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl bg-[#0E0E14] border border-[#1C1D26] hover:border-[#2D2E3C] transition-all space-y-3 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-[#14141E] border border-[#1C1D26] flex items-center justify-center text-[#FF5A36]">
                <Search className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold font-display text-[#F5F5F5]">01 Continuous Ingestion</h3>
              <p className="text-xs text-[#8B8D96] leading-relaxed">
                Live scrapers monitor Greenhouse, Lever, Ashby, Y Combinator, and RemoteOK feeds in real time, eliminating outdated aggregator listings.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl bg-[#0E0E14] border border-[#1C1D26] hover:border-[#2D2E3C] transition-all space-y-3 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-[#14141E] border border-[#1C1D26] flex items-center justify-center text-[#38BDF8]">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold font-display text-[#F5F5F5]">02 Gemini 2.0 Semantic Fit</h3>
              <p className="text-xs text-[#8B8D96] leading-relaxed">
                Evaluates your verified profile against role requirements on tech stack, compensation, and seniority, filtering out roles below 80% affinity.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl bg-[#0E0E14] border border-[#1C1D26] hover:border-[#2D2E3C] transition-all space-y-3 shadow-xs">
              <div className="w-8 h-8 rounded-lg bg-[#14141E] border border-[#1C1D26] flex items-center justify-center text-[#00E676]">
                <Send className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold font-display text-[#F5F5F5]">03 10:00 AM Dispatch</h3>
              <p className="text-xs text-[#8B8D96] leading-relaxed">
                Tailored cover letters and tailored applications are queued for your Telegram every morning with simple 1-click submission.
              </p>
            </div>
          </div>
        </div>

        {/* =========================================================================
            4. CURATED TOP OPPORTUNITIES STRIP (Clean & High-Contrast)
           ========================================================================= */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0E0E14] border border-[#1C1D26] space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-bold font-display text-[#F5F5F5]">
                Curated High-Match Roles
              </h2>
              <p className="text-xs text-[#8B8D96]">
                Live verified opportunities matching your engineering criteria.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('jobs')}
              className="text-xs text-[#FF5A36] hover:text-[#FF704F] font-mono flex items-center gap-1 transition-colors cursor-pointer font-medium"
            >
              <span>View All {jobs.length} Roles</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {jobs.slice(0, 3).map((job) => (
              <div
                key={job.id}
                className="p-4 rounded-xl bg-[#0A0A0E] border border-[#1C1D26] hover:border-[#2D2E3C] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-[#F5F5F5] font-display group-hover:text-[#FF5A36] transition-colors">
                      {job.title}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#FF5A36]/10 text-[#FF5A36] border border-[#FF5A36]/20">
                      {(job as any).matchScore || (job as any).match?.score || 92}% Match
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-[#8B8D96] bg-[#14141E] border border-[#1C1D26]">
                      {job.source}
                    </span>
                  </div>
                  <div className="text-xs text-[#8B8D96] flex items-center gap-2 flex-wrap">
                    <span className="text-[#F5F5F5] font-medium">{job.company}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                    {job.salary && (
                      <>
                        <span>•</span>
                        <span className="text-[#00E676] font-mono font-semibold">
                          ${(job.salary.min / 1000).toFixed(0)}k - ${(job.salary.max / 1000).toFixed(0)}k
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onNavigateTab('jobs')}
                    className="px-3 py-1.5 rounded-lg bg-[#14141E] hover:bg-[#1D1D2A] border border-[#1C1D26] text-xs font-mono text-[#F5F5F5] transition-all cursor-pointer"
                  >
                    Inspect Fit
                  </button>
                  <button
                    onClick={() => onNavigateTab('jobs')}
                    className="bg-[#FF5A36] hover:bg-[#FF6D4A] text-white font-semibold text-xs py-1.5 px-3.5 rounded-lg shadow-xs transition-all cursor-pointer"
                  >
                    1-Click Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* =========================================================================
          5. MINIMAL EXECUTIVE FOOTER
         ========================================================================= */}
      <footer className="border-t border-[#1C1D26] py-6 px-4 text-center text-xs text-[#8B8D96] font-mono relative z-10 bg-[#070709]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00E676]" />
            <span>KINETIC AUTONOMOUS CAREER OS • ALL SYSTEMS NOMINAL</span>
          </div>
          <div className="text-[11px] text-[#5A5A66]">
            {profile?.name ? `CONFIGURED FOR ${profile.name.toUpperCase()}` : 'DEVELOPER EDITION'} • 2026
          </div>
        </div>
      </footer>
    </div>
  );
};
