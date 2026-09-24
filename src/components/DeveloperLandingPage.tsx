import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Zap,
  CheckCircle2,
  Search,
  ChevronRight,
  Layers,
  Send,
  Cpu,
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Terminal,
  Activity,
  Compass
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
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const telemetryLogs = [
    { time: '10:00:01 AM', tag: 'INGEST', text: 'Scanning live feeds (Greenhouse, Ashby, Lever, Y Combinator)...', color: 'text-[#8B8D96]' },
    { time: '10:00:03 AM', tag: 'EVALUATE', text: 'Gemini 2.0 multi-factor semantic fit scoring across 64 incoming roles.', color: 'text-[#38BDF8]' },
    { time: '10:00:05 AM', tag: 'MATCH', text: '3 high-affinity roles identified with ≥88% technical stack & seniority match.', color: 'text-[#00E676]' },
    { time: '10:00:07 AM', tag: 'SYNTHESIS', text: 'Crafting bespoke cover letter tailored with verified candidate citations.', color: 'text-[#FF5A36]' },
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
    <div className="min-h-screen bg-[#F9F8F5] text-[#111114] flex flex-col justify-between selection:bg-[#FF5A36]/20 selection:text-[#FF5A36] font-['Inter',sans-serif] relative overflow-hidden transition-colors duration-500">
      {/* 1. Organic Tactile Film Grain / Noise Overlay */}
      <div
        className="pointer-events-none fixed inset-0 w-full h-full opacity-[0.035] mix-blend-multiply z-30 select-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* 2. Interactive Ambient Cursor Spotlight */}
      <div
        className="pointer-events-none fixed w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#FF5A36]/10 via-[#F59E0B]/6 to-transparent blur-3xl -translate-x-1/2 -translate-y-1/2 transition-opacity duration-300 z-10"
        style={{
          left: `${mousePos.x}px`,
          top: `${mousePos.y}px`,
        }}
      />

      {/* 3. Concentrated Atmospheric Aurora Glow Flare */}
      <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[760px] h-[360px] bg-gradient-to-r from-[#FF5A36]/12 via-[#F59E0B]/8 to-[#FF5A36]/10 blur-[120px] pointer-events-none rounded-full -z-0" />

      {/* Main Container */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-12 pb-24 w-full space-y-20 relative z-20">
        
        {/* =========================================================================
            1. HERO SECTION (Editorial Luxury Typography with Attention-Grabbing Reveal)
           ========================================================================= */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-7 max-w-3xl mx-auto pt-4"
        >
          {/* Status Announcement Pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-[#E5E2DC] text-xs font-mono select-none shadow-[0_2px_10px_rgba(0,0,0,0.04)] backdrop-blur-md"
          >
            <span className="w-2 h-2 rounded-full bg-[#00C853] animate-pulse" />
            <span className="text-[#6A6C76] uppercase tracking-wider font-semibold">KINETIC 2.0</span>
            <span className="text-[#D0CDC5]">•</span>
            <span className="text-[#111114] font-medium">{schedulerConfig?.dailyMorningTime || '10:00 AM'} DISPATCH</span>
            <span className="text-[#D0CDC5]">•</span>
            <span className="text-[#FF5A36] font-semibold">AUTONOMOUS</span>
          </motion.div>

          {/* Master Headline Container */}
          <div className="relative w-full py-2 my-1">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-display tracking-tight text-[#111114] leading-[1.08] relative z-10">
              Engineering your <span className="font-editorial-italic font-normal text-[#1A1A1E]">career,</span>
              <br />
              <span className="text-[#111114]">completely </span>
              <span className="text-[#FF5A36] inline-block font-display">
                autonomously.
              </span>
            </h1>
          </div>

          {/* Subtitle Value Proposition */}
          <p className="text-sm sm:text-base text-[#52545E] max-w-xl mx-auto leading-relaxed font-sans font-normal">
            Continuous discovery across verified tech pipelines, multi-factor Gemini 2.0 evaluation, and bespoke tailored applications dispatched to your Telegram at 10:00 AM.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={handleRunMorning}
              disabled={isRunningMorning}
              className="w-full sm:w-auto bg-[#FF5A36] hover:bg-[#FF451A] text-white font-semibold text-xs sm:text-sm py-3 px-6 rounded-xl shadow-[0_8px_20px_rgba(255,90,54,0.25)] hover:shadow-[0_12px_28px_rgba(255,90,54,0.35)] transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
            >
              <Zap className={`w-4 h-4 ${isRunningMorning ? 'animate-spin' : ''}`} />
              <span>{isRunningMorning ? 'Executing Morning Routine...' : '⚡ Run 10:00 AM Routine'}</span>
            </button>

            <button
              onClick={() => onNavigateTab('jobs')}
              className="w-full sm:w-auto bg-white hover:bg-[#F3F1EC] border border-[#E2DFD7] hover:border-[#D0CDC5] text-[#111114] text-xs sm:text-sm py-3 px-5 rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.03)] transition-all duration-200 flex items-center justify-center gap-2 font-medium cursor-pointer hover:-translate-y-0.5"
            >
              <Search className="w-4 h-4 text-[#FF5A36]" />
              <span>Explore Live Feeds ({jobs.length})</span>
            </button>

            <button
              onClick={onEnterApp}
              className="w-full sm:w-auto bg-white/80 hover:bg-white border border-[#E2DFD7] hover:border-[#D0CDC5] text-[#52545E] hover:text-[#111114] text-xs sm:text-sm py-3 px-5 rounded-xl shadow-[0_2px_6px_rgba(0,0,0,0.02)] transition-all duration-200 flex items-center justify-center gap-2 font-medium cursor-pointer hover:-translate-y-0.5"
            >
              <Layers className="w-4 h-4 text-[#7C7E89]" />
              <span>Open Dashboard</span>
            </button>
          </div>

          {/* Routine Result Banner */}
          {morningResult && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3.5 rounded-xl bg-white border border-[#00C853]/40 text-xs text-[#00A844] font-mono flex items-center justify-center gap-2 max-w-xl mx-auto shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4 shrink-0 text-[#00C853]" />
              <span>{morningResult}</span>
            </motion.div>
          )}
        </motion.div>

        {/* =========================================================================
            2. INTERACTIVE KINETIC OS LIVE AGENT CONSOLE (Linear / Raycast Terminal Style)
           ========================================================================= */}
        <div className="rounded-2xl bg-[#0E0E14] border border-[#1C1D26] shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden max-w-4xl mx-auto">
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
                  <span>Agent standing by for next scheduled dispatch cycle ({schedulerConfig?.dailyMorningTime || '10:00 AM'})</span>
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
                  <p className="text-[11px] text-[#5A5A66]">Competitive Base + Equity aligned with candidate bandwidth</p>
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
                  "Having architected autonomous agent workflows that interface with real-time vector databases and LLMs, I noticed your team is building scalable multi-agent infrastructure. In my previous work, I designed a resilient execution graph that cut job dispatch latency by 45%..."
                </p>
                <div className="flex items-center gap-2 pt-1 text-[11px] font-mono text-[#8B8D96]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#00E676]" />
                  <span>Citations verified against candidate profile experience record.</span>
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
            <h2 className="text-2xl sm:text-3xl font-extrabold font-display text-[#111114]">
              Designed for zero busywork.
            </h2>
            <p className="text-xs sm:text-sm text-[#6A6C76] max-w-md mx-auto">
              Replace hundreds of manual job boards with a self-executing autonomous career agent.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Pillar 1 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E5E2DC] hover:border-[#D0CDC5] transition-all duration-200 space-y-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] group">
              <div className="w-9 h-9 rounded-xl bg-[#FAF9F5] border border-[#E5E2DC] flex items-center justify-center text-[#FF5A36] group-hover:scale-105 transition-transform">
                <Search className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold font-display text-[#111114]">01 Continuous Ingestion</h3>
              <p className="text-xs text-[#6A6C76] leading-relaxed">
                Live scrapers monitor Greenhouse, Lever, Ashby, Y Combinator, and RemoteOK feeds in real time, eliminating outdated aggregator listings.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E5E2DC] hover:border-[#D0CDC5] transition-all duration-200 space-y-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] group">
              <div className="w-9 h-9 rounded-xl bg-[#FAF9F5] border border-[#E5E2DC] flex items-center justify-center text-[#38BDF8] group-hover:scale-105 transition-transform">
                <Cpu className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold font-display text-[#111114]">02 Gemini 2.0 Semantic Fit</h3>
              <p className="text-xs text-[#6A6C76] leading-relaxed">
                Evaluates your verified profile against role requirements on tech stack, compensation, and seniority, filtering out roles below 80% affinity.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="p-6 rounded-2xl bg-white border border-[#E5E2DC] hover:border-[#D0CDC5] transition-all duration-200 space-y-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.06)] group">
              <div className="w-9 h-9 rounded-xl bg-[#FAF9F5] border border-[#E5E2DC] flex items-center justify-center text-[#00C853] group-hover:scale-105 transition-transform">
                <Send className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold font-display text-[#111114]">03 10:00 AM Dispatch</h3>
              <p className="text-xs text-[#6A6C76] leading-relaxed">
                Tailored cover letters and tailored applications are queued for your Telegram every morning with simple 1-click submission.
              </p>
            </div>
          </div>
        </div>

        {/* =========================================================================
            4. CURATED TOP OPPORTUNITIES STRIP (Clean & High-Contrast)
           ========================================================================= */}
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-[#E5E2DC] shadow-[0_2px_16px_rgba(0,0,0,0.03)] space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-bold font-display text-[#111114]">
                Curated High-Match Roles
              </h2>
              <p className="text-xs text-[#6A6C76]">
                Live verified opportunities matching your engineering criteria.
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('jobs')}
              className="text-xs text-[#FF5A36] hover:text-[#FF451A] font-mono flex items-center gap-1 transition-colors cursor-pointer font-semibold"
            >
              <span>View All {jobs.length} Roles</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {jobs.slice(0, 3).map((job) => (
              <div
                key={job.id}
                className="p-4 rounded-xl bg-[#FAF9F5] border border-[#EAE7E0] hover:bg-white hover:border-[#D8D4CA] hover:shadow-xs transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-bold text-[#111114] font-display group-hover:text-[#FF5A36] transition-colors">
                      {job.title}
                    </span>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#FF5A36]/10 text-[#FF5A36] border border-[#FF5A36]/20">
                      {(job as any).matchScore || (job as any).match?.score || 92}% Match
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono text-[#6A6C76] bg-white border border-[#E5E2DC]">
                      {job.source}
                    </span>
                  </div>
                  <div className="text-xs text-[#6A6C76] flex items-center gap-2 flex-wrap">
                    <span className="text-[#111114] font-medium">{job.company}</span>
                    <span>•</span>
                    <span>{job.location}</span>
                    {job.salary && (
                      <>
                        <span>•</span>
                        <span className="text-[#00A844] font-mono font-semibold">
                          ${(job.salary.min / 1000).toFixed(0)}k - ${(job.salary.max / 1000).toFixed(0)}k
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => onNavigateTab('jobs')}
                    className="px-3 py-1.5 rounded-lg bg-white hover:bg-[#F4F2EC] border border-[#DCD9D1] text-xs font-mono text-[#111114] transition-all cursor-pointer font-medium"
                  >
                    Inspect Fit
                  </button>
                  <button
                    onClick={() => onNavigateTab('jobs')}
                    className="bg-[#FF5A36] hover:bg-[#FF451A] text-white font-semibold text-xs py-1.5 px-3.5 rounded-lg shadow-xs transition-all cursor-pointer"
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
      <footer className="border-t border-[#E5E2DC] py-6 px-4 text-center text-xs text-[#6A6C76] font-mono relative z-10 bg-[#F4F2EC]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00C853]" />
            <span className="text-[#111114] font-medium">KINETIC AUTONOMOUS CAREER OS</span>
            <span>•</span>
            <span>ALL SYSTEMS NOMINAL</span>
          </div>
          <div className="text-[11px] text-[#6A6C76]">
            {profile?.name ? `CONFIGURED FOR ${profile.name.toUpperCase()}` : 'DEVELOPER EDITION'} • 2026
          </div>
        </div>
      </footer>
    </div>
  );
};
