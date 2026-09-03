import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Terminal,
  Code2,
  Cpu,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  Layers,
  Bot,
  ExternalLink,
  ChevronRight,
  Copy,
  Check,
  Flame,
  Globe,
  Database,
  Search,
  FileCheck,
  Mail,
  Send,
  Sliders,
  CheckCircle2,
  Clock
} from 'lucide-react';
import DynamicIsland, { DynamicIslandView } from './smoothui/dynamic-island';

interface DeveloperLandingPageProps {
  onLaunchWorkbench: (tab?: string) => void;
  stats?: {
    totalApplications: number;
    newMatchesCount: number;
    interviewCount: number;
    averageMatchScore: number;
  };
}

export const DeveloperLandingPage: React.FC<DeveloperLandingPageProps> = ({
  onLaunchWorkbench,
  stats = {
    totalApplications: 14,
    newMatchesCount: 38,
    interviewCount: 3,
    averageMatchScore: 89,
  }
}) => {
  const [activeTabCode, setActiveTabCode] = useState<'typescript' | 'python' | 'cli' | 'rest'>('typescript');
  const [copiedCode, setCopiedCode] = useState(false);
  const [simRunning, setSimRunning] = useState(false);
  const [activeStepPreview, setActiveStepPreview] = useState(0);
  const [islandView, setIslandView] = useState<DynamicIslandView>('idle');

  const codeSnippets = {
    typescript: `import { AgentRuntime, GreenhouseIngestor, GeminiFitEvaluator } from '@agentengine/sdk';

// 1. Initialize Autonomous Agent
const runtime = new AgentRuntime({
  apiKey: process.env.AGENT_ENGINE_API_KEY,
  model: 'gemini-2.0-flash',
  memory: 'pgvector://candidate-profile-v2'
});

// 2. Register Search & Ingestion Connectors
runtime.use(new GreenhouseIngestor({ targetRoles: ['Senior Full Stack', 'AI Engineer'] }));

// 3. Define Reasoning Pipeline & Dispatch
runtime.onCandidateMatch(async (job) => {
  const fit = await GeminiFitEvaluator.evaluate(job, candidateResume);
  if (fit.score >= 85) {
    const letter = await runtime.synthesizeCoverLetter({ job, citations: true });
    await runtime.dispatchApplication({ job, letter, humanApproval: true });
  }
});

await runtime.startDailySchedule({ targetTime: '10:00:00Z', quota: 5 });`,
    python: `from agentengine import AgentRuntime, MultiBoardIngestor, GeminiScorer

# Initialize agent instance
agent = AgentRuntime(
    model="gemini-2.0-flash",
    strict_citation=True,
    safety_gate="HUMAN_IN_THE_LOOP"
)

# Ingest and score matching roles
jobs = agent.ingest_live_boards(["remoteok", "lever", "greenhouse"])
matches = agent.score_candidate_fit(jobs, min_score=85)

for match in matches:
    app_package = agent.synthesize_application(match)
    agent.queue_for_approval(app_package)

print(f"✓ {len(matches)} high-fit applications queued for 10:00 AM dispatch.")`,
    cli: `$ npx @agentengine/cli scan --sources=all --min-match=85
[09:59:52] ⠋ Connecting to PostgreSQL vector store...
[09:59:53] ✓ Ingested 124 live postings across RemoteOK, Lever, Ashby
[09:59:54] ✓ Gemini 2.0 scored 38 roles against candidate resume
[09:59:55] ✓ 5 target applications prepared with truthful citations
[09:59:56] ⚡ 10:00 AM Morning Dispatch complete. Telegram alert sent.`,
    rest: `curl -X POST https://api.agentengine.dev/v1/agent/run \\
  -H "Authorization: Bearer ae_live_79a8bc430e..." \\
  -H "Content-Type: application/json" \\
  -d '{
    "goal": "Daily 10:00 AM Auto-Apply Routine",
    "min_match_score": 85,
    "max_applications": 5,
    "require_human_approval": true,
    "channels": ["telegram", "email_digest"]
  }'`
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleRunSim = () => {
    setSimRunning(true);
    setActiveStepPreview(0);
    setIslandView('scanning');
    const interval = setInterval(() => {
      setActiveStepPreview((prev) => {
        if (prev >= 3) {
          clearInterval(interval);
          setSimRunning(false);
          setIslandView('recruiter');
          return 3;
        }
        const next = prev + 1;
        if (next === 1) setIslandView('match');
        if (next === 2) setIslandView('dispatch');
        if (next === 3) setIslandView('recruiter');
        return next;
      });
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-[#111111] font-['Geist',sans-serif] selection:bg-[#FFE8E1] selection:text-[#FF5A36]">
      {/* 2. HERO SECTION */}
      <section className="pt-16 pb-16 sm:pt-24 sm:pb-24 border-b border-[#DDDAD2] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl space-y-6">
            {/* Monospace Eyebrow */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FFE8E1] border border-[#FF5A36]/20 text-[#FF5A36] text-[12px] font-mono font-medium tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A36] animate-pulse" />
              <span>The Autonomous Career & Application Infrastructure</span>
            </div>

            {/* Massive Editorial Headline */}
            <h1 className="text-5xl sm:text-7xl lg:text-[84px] font-normal font-editorial tracking-tight leading-[1.03] text-[#111111]">
              Engineered for autonomy. <br />
              <span className="italic text-[#6B6B67]">Designed to close interviews.</span>
            </h1>

            {/* Short Sharp Description */}
            <p className="text-lg sm:text-xl text-[#6B6B67] max-w-2xl leading-relaxed font-normal">
              A deterministic multi-step agent runtime that scans live hiring portals, evaluates multi-factor technical fit, writes verifiable bespoke cover letters, and auto-dispatches at 10:00 AM.
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={() => onLaunchWorkbench('dashboard')}
                className="btn-accent px-6 py-3.5 text-[15px] font-medium"
              >
                <span>Start Autonomous Search</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onLaunchWorkbench('agent')}
                className="btn-secondary-outline px-6 py-3.5 text-[15px] font-medium"
              >
                <Terminal className="w-4 h-4 text-[#6B6B67]" />
                <span>Open Agent Console</span>
              </button>

              <a
                href="#developers"
                className="text-[14px] font-medium text-[#6B6B67] hover:text-[#111111] flex items-center gap-1.5 px-3 py-2 transition-colors ml-1"
              >
                <span>View SDK Architecture</span>
                <ChevronRight className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Hero Technical Product Visualization */}
          <div className="mt-14 pt-8 border-t border-[#DDDAD2]">
            <div className="editorial-card overflow-hidden shadow-xs">
              {/* Terminal Window Bar */}
              <div className="px-4 py-3 bg-[#F7F6F2] border-b border-[#DDDAD2] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#DDDAD2]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#DDDAD2]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#DDDAD2]" />
                  <span className="text-xs font-mono text-[#6B6B67] ml-2">jobagent-runtime — v2.4.0 (active)</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#6B6B67]">
                    <span className="w-2 h-2 rounded-full bg-[#FF5A36] animate-pulse" />
                    <span>DAILY TARGET: 10:00 AM</span>
                  </div>
                  <button
                    onClick={handleRunSim}
                    disabled={simRunning}
                    className="px-2.5 py-1 rounded bg-[#FCFBF8] border border-[#DDDAD2] text-[11px] font-mono text-[#111111] hover:border-[#111111] transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {simRunning ? 'Executing Loop...' : 'Trigger Simulation'}
                  </button>
                </div>
              </div>

              {/* Kinetic Live Telemetry Dynamic Island HUD */}
              <div className="py-7 px-4 bg-[#FAF9F5] border-b border-[#DDDAD2] flex flex-col items-center justify-center">
                <div className="text-center mb-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#6B6B67]">
                    KINETIC AGENT HUD • REAL-TIME STATE SYNC
                  </span>
                </div>
                <DynamicIsland
                  view={islandView}
                  onViewChange={setIslandView}
                  showControls={true}
                />
              </div>

              {/* Visualization Grid: Terminal Trace + Live Agent State */}
              <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#DDDAD2] bg-[#FCFBF8]">
                {/* Left 7 Cols: Real-Time Execution Trace */}
                <div className="lg:col-span-7 p-5 sm:p-6 space-y-4 font-mono text-xs">
                  <div className="flex items-center justify-between text-[#6B6B67] border-b border-[#DDDAD2] pb-2 text-[11px]">
                    <span>REASONING EXECUTION LOG</span>
                    <span>LATENCY: 480ms</span>
                  </div>

                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    <div className="flex items-start gap-2 text-[#6B6B67]">
                      <span className="text-[#FF5A36]">[09:59:58]</span>
                      <span>Ingesting multi-source endpoints (RemoteOK, Lever, Ashby, Greenhouse)...</span>
                    </div>

                    <div className="flex items-start gap-2 text-[#111111]">
                      <span className="text-[#FF5A36]">[10:00:01]</span>
                      <span>✓ 142 jobs discovered. 47 candidates deduplicated.</span>
                    </div>

                    <div className="flex items-start gap-2 text-[#111111]">
                      <span className="text-[#FF5A36]">[10:00:02]</span>
                      <span>→ Executing Gemini 2.0 Fit Scorer against candidate resume profile.</span>
                    </div>

                    <div className="p-3 rounded-lg bg-[#F7F6F2] border border-[#DDDAD2] space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between text-[#111111] font-semibold">
                        <span>Staff Distributed Systems Engineer @ Stripe</span>
                        <span className="text-[#FF5A36]">94% Match</span>
                      </div>
                      <p className="text-[#6B6B67] font-sans">
                        Reason: 6+ yrs Go & Kafka experience directly aligns with role's primary ledger infrastructure requirements.
                      </p>
                    </div>

                    <div className="flex items-start gap-2 text-[#111111]">
                      <span className="text-[#FF5A36]">[10:00:04]</span>
                      <span>✓ Synthesized bespoke cover letter citing verified past transactions metrics.</span>
                    </div>

                    <div className="flex items-start gap-2 text-[#111111]">
                      <span className="text-[#FF5A36]">[10:00:05]</span>
                      <span>⚡ Human-In-The-Loop approval gate passed. 5 target applications dispatched.</span>
                    </div>
                  </div>
                </div>

                {/* Right 5 Cols: Live Metric & Candidate Fit Status */}
                <div className="lg:col-span-5 p-5 sm:p-6 space-y-5 bg-[#FAF9F5]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#6B6B67]">Pipeline Telemetry</span>
                    <span className="text-xs font-mono text-[#FF5A36] bg-[#FFE8E1] px-2 py-0.5 rounded">ALL SYSTEMS HEALTHY</span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-lg bg-[#FCFBF8] border border-[#DDDAD2] space-y-1">
                      <span className="text-[11px] font-mono text-[#6B6B67] block">Active Matches</span>
                      <span className="text-2xl font-editorial text-[#111111]">{stats.newMatchesCount}</span>
                    </div>
                    <div className="p-3.5 rounded-lg bg-[#FCFBF8] border border-[#DDDAD2] space-y-1">
                      <span className="text-[11px] font-mono text-[#6B6B67] block">Avg AI Fit</span>
                      <span className="text-2xl font-editorial text-[#FF5A36]">{stats.averageMatchScore}%</span>
                    </div>
                    <div className="p-3.5 rounded-lg bg-[#FCFBF8] border border-[#DDDAD2] space-y-1">
                      <span className="text-[11px] font-mono text-[#6B6B67] block">Submitted</span>
                      <span className="text-2xl font-editorial text-[#111111]">{stats.totalApplications}</span>
                    </div>
                    <div className="p-3.5 rounded-lg bg-[#FCFBF8] border border-[#DDDAD2] space-y-1">
                      <span className="text-[11px] font-mono text-[#6B6B67] block">Interviews</span>
                      <span className="text-2xl font-editorial text-[#111111]">{stats.interviewCount}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onLaunchWorkbench('dashboard')}
                    className="w-full py-2.5 px-4 rounded-lg bg-[#111111] hover:bg-[#222222] text-white text-xs font-medium flex items-center justify-center gap-2 transition-all"
                  >
                    <span>Open Live Operating Dashboard</span>
                    <ArrowRight className="w-3.5 h-3.5 text-[#FF5A36]" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TRUST & SOCIAL PROOF */}
      <section className="py-12 border-b border-[#DDDAD2] bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#6B6B67] text-center mb-8">
            Engineered on trusted developer and AI infrastructure
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-items-center opacity-70 grayscale hover:grayscale-0 transition-all text-xs font-mono text-[#111111]">
            <div className="flex items-center gap-2 font-semibold">
              <span className="p-1 rounded bg-[#DDDAD2]/50">YC</span>
              <span>ALUMNI BACKED</span>
            </div>
            <div className="flex items-center gap-2 font-semibold">
              <Database className="w-4 h-4 text-[#6B6B67]" />
              <span>PGVECTOR</span>
            </div>
            <div className="flex items-center gap-2 font-semibold">
              <Zap className="w-4 h-4 text-[#FF5A36]" />
              <span>GEMINI 2.0 FLASH</span>
            </div>
            <div className="flex items-center gap-2 font-semibold">
              <Globe className="w-4 h-4 text-[#6B6B67]" />
              <span>GREENHOUSE API</span>
            </div>
            <div className="flex items-center gap-2 font-semibold">
              <Layers className="w-4 h-4 text-[#6B6B67]" />
              <span>LEVER CONNECTOR</span>
            </div>
            <div className="flex items-center gap-2 font-semibold">
              <Terminal className="w-4 h-4 text-[#6B6B67]" />
              <span>TYPESCRIPT SDK</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PRODUCT SECTION (Workflow & Terminal Environment) */}
      <section id="product" className="py-20 sm:py-28 border-b border-[#DDDAD2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#FF5A36]">Core Product Workflow</span>
            <h2 className="text-4xl sm:text-5xl lg:text-[46px] font-normal font-editorial tracking-tight text-[#111111] leading-[1.1]">
              A complete runtime for deterministic job hunting.
            </h2>
            <p className="text-[#6B6B67] text-base leading-relaxed">
              Replace manual form-filling with an agent loop that runs in the background, scores every requirement against your proven track record, and generates tailored cover letters.
            </p>
          </div>

          {/* Interactive 3-Panel Visual Workflow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 Card */}
            <div className="editorial-card p-6 sm:p-7 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#FF5A36] font-bold">STAGE 01</span>
                  <Search className="w-4 h-4 text-[#6B6B67]" />
                </div>
                <h3 className="text-2xl font-editorial text-[#111111]">Multi-Source Ingestion</h3>
                <p className="text-sm text-[#6B6B67] leading-relaxed">
                  Connects directly to RemoteOK, Arbeitnow, Greenhouse, Lever, and custom URL parsers to ingest clean job payloads without spam or duplicate postings.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#F7F6F2] border border-[#DDDAD2] text-xs font-mono text-[#6B6B67] space-y-1">
                <div className="flex justify-between">
                  <span>Greenhouse API</span>
                  <span className="text-[#111111]">✓ Synced</span>
                </div>
                <div className="flex justify-between">
                  <span>Lever Webhooks</span>
                  <span className="text-[#111111]">✓ Synced</span>
                </div>
                <div className="flex justify-between">
                  <span>RemoteOK Feed</span>
                  <span className="text-[#111111]">✓ Synced</span>
                </div>
              </div>
            </div>

            {/* Step 2 Card */}
            <div className="editorial-card p-6 sm:p-7 space-y-4 flex flex-col justify-between bg-[#FAF9F5]">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#FF5A36] font-bold">STAGE 02</span>
                  <Cpu className="w-4 h-4 text-[#FF5A36]" />
                </div>
                <h3 className="text-2xl font-editorial text-[#111111]">Multi-Factor Match Scoring</h3>
                <p className="text-sm text-[#6B6B67] leading-relaxed">
                  Evaluates candidate experience, tech stack depth, compensation range, and location preferences against the job description with verifiable citations.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#FCFBF8] border border-[#DDDAD2] text-xs font-mono space-y-1.5">
                <div className="flex justify-between text-[#111111] font-semibold">
                  <span>Fit Score Threshold</span>
                  <span className="text-[#FF5A36]">85%+ Minimum</span>
                </div>
                <div className="w-full bg-[#DDDAD2] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#FF5A36] h-full rounded-full w-[89%]" />
                </div>
                <span className="text-[10px] text-[#6B6B67] block">Strict zero-hallucination policy enabled</span>
              </div>
            </div>

            {/* Step 3 Card */}
            <div className="editorial-card p-6 sm:p-7 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#FF5A36] font-bold">STAGE 03</span>
                  <Send className="w-4 h-4 text-[#6B6B67]" />
                </div>
                <h3 className="text-2xl font-editorial text-[#111111]">10:00 AM Morning Dispatch</h3>
                <p className="text-sm text-[#6B6B67] leading-relaxed">
                  Applies to 5+ qualified positions each morning, notifies candidate via Telegram, and monitors inbound recruiter emails for interview scheduling.
                </p>
              </div>

              <div className="p-3 rounded-lg bg-[#F7F6F2] border border-[#DDDAD2] text-xs font-mono text-[#6B6B67] space-y-1">
                <div className="flex justify-between">
                  <span>Morning Target</span>
                  <span className="text-[#111111]">10:00:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <span>Telegram Alerts</span>
                  <span className="text-[#FF5A36]">Instant Push</span>
                </div>
                <div className="flex justify-between">
                  <span>Recruiter Classifier</span>
                  <span className="text-[#111111]">Auto-Triage</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. ASYMMETRIC FEATURES SECTION */}
      <section id="features" className="py-20 sm:py-28 border-b border-[#DDDAD2] bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#FF5A36]">Feature Breakdown</span>
              <h2 className="text-4xl sm:text-5xl font-normal font-editorial tracking-tight text-[#111111]">
                Built like developer tools. <br />
                <span className="italic text-[#6B6B67]">Not marketing fluff.</span>
              </h2>
            </div>

            <button
              onClick={() => onLaunchWorkbench('jobs')}
              className="btn-secondary-outline text-xs self-start sm:self-auto"
            >
              <span>Explore Live Job Feed</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Asymmetric Bento Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Feature 1: Large 8-col card */}
            <div className="lg:col-span-8 editorial-card p-7 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#6B6B67] uppercase tracking-wider">01 / REASONING ENGINE</span>
                <span className="px-2.5 py-0.5 rounded bg-[#FFE8E1] text-[#FF5A36] text-xs font-mono font-semibold">GEMINI 2.0 FLASH</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-3xl font-editorial text-[#111111]">Verifiable Cover Letters & Custom Q&A</h3>
                <p className="text-sm text-[#6B6B67] leading-relaxed max-w-xl">
                  Unlike generic GPT wrappers that hallucinate fake achievements, JobAgent is constrained to cite real historical projects, GitHub repositories, and verified engineering metrics from your parsed candidate profile.
                </p>
              </div>

              <div className="p-4 rounded-lg bg-[#F7F6F2] border border-[#DDDAD2] font-mono text-xs text-[#111111] space-y-2">
                <div className="flex items-center gap-2 text-[#FF5A36] text-[11px] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>GROUNDED CITATION SAMPLE:</span>
                </div>
                <p className="text-[#6B6B67] font-sans text-xs italic">
                  "In my previous role as Lead Architect, I reduced high-concurrency p99 latency from 1.4s to 120ms by migrating Postgres queues to Redis streams—directly solving the scaling challenge noted in your job description."
                </p>
              </div>
            </div>

            {/* Feature 2: 4-col card */}
            <div className="lg:col-span-4 editorial-card p-7 sm:p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-mono text-[#6B6B67] uppercase tracking-wider">02 / RECRUITER TRIAGE</span>
                <h3 className="text-2xl sm:text-3xl font-editorial text-[#111111]">Inbound Email Classifier</h3>
                <p className="text-xs text-[#6B6B67] leading-relaxed">
                  Monitors recruiter responses, classifies interview requests vs. rejections, and auto-syncs Kanban stages in real time.
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-[#DDDAD2] text-xs font-mono">
                <div className="flex items-center justify-between p-2 rounded bg-[#F7F6F2]">
                  <span className="text-[#111111]">Interview Invite</span>
                  <span className="text-[#FF5A36] font-bold">Auto-Stage</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded bg-[#F7F6F2]">
                  <span className="text-[#6B6B67]">Rejection Notice</span>
                  <span className="text-[#6B6B67]">Auto-Archive</span>
                </div>
              </div>
            </div>

            {/* Feature 3: 4-col card */}
            <div className="lg:col-span-4 editorial-card p-7 sm:p-8 space-y-6 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-mono text-[#6B6B67] uppercase tracking-wider">03 / SAFETY CONTROLS</span>
                <h3 className="text-2xl sm:text-3xl font-editorial text-[#111111]">Human-In-The-Loop</h3>
                <p className="text-xs text-[#6B6B67] leading-relaxed">
                  Every cover letter, resume variant, and custom portal answer is staged in an approval queue before any submission payload is dispatched.
                </p>
              </div>

              <div className="p-3.5 rounded-lg bg-[#F7F6F2] border border-[#DDDAD2] text-xs font-mono space-y-1">
                <span className="text-[#111111] font-semibold block">Safety Guarantees:</span>
                <span className="text-[#6B6B67] text-[11px] block">✓ Salary floor enforcement ($140k+)</span>
                <span className="text-[#6B6B67] text-[11px] block">✓ Remote-only strict verification</span>
                <span className="text-[#6B6B67] text-[11px] block">✓ No duplicate submissions</span>
              </div>
            </div>

            {/* Feature 4: 8-col card */}
            <div className="lg:col-span-8 editorial-card p-7 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#6B6B67] uppercase tracking-wider">04 / NOTIFICATIONS & SYNC</span>
                <span className="text-xs font-mono text-[#FF5A36]">TELEGRAM + GMAIL</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-3xl font-editorial text-[#111111]">Instant Telegram Alerts & HTML Morning Digest</h3>
                <p className="text-sm text-[#6B6B67] leading-relaxed max-w-xl">
                  Receive instant Telegram messages whenever a strong fit is identified or an interview invitation is detected, plus an executive morning summary with direct approval buttons.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3 rounded bg-[#F7F6F2] border border-[#DDDAD2]">
                  <span className="text-[#111111] font-semibold block">Telegram Bot Push</span>
                  <span className="text-[#6B6B67] text-[11px]">Real-time application status & quick approve CTAs</span>
                </div>
                <div className="p-3 rounded bg-[#F7F6F2] border border-[#DDDAD2]">
                  <span className="text-[#111111] font-semibold block">Morning Gmail Digest</span>
                  <span className="text-[#6B6B67] text-[11px]">HTML summary of all 5 jobs submitted at 10 AM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS (3-Step Numbered Architecture) */}
      <section id="how-it-works" className="py-20 sm:py-28 border-b border-[#DDDAD2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#FF5A36]">Step-By-Step Architecture</span>
            <h2 className="text-4xl sm:text-5xl font-normal font-editorial tracking-tight text-[#111111]">
              How the Autonomous Agent executes every day.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Numbered Step 1 */}
            <div className="space-y-4 border-t border-[#DDDAD2] pt-6">
              <span className="text-5xl sm:text-6xl font-editorial text-[#6B6B67] font-normal block">01</span>
              <h3 className="text-2xl font-editorial text-[#111111]">Parse & Vectorize Resume</h3>
              <p className="text-sm text-[#6B6B67] leading-relaxed">
                Upload your existing PDF or markdown resume. The parser extracts tech stacks, milestone achievements, years of experience, and target salary requirements.
              </p>
            </div>

            {/* Numbered Step 2 */}
            <div className="space-y-4 border-t border-[#DDDAD2] pt-6">
              <span className="text-5xl sm:text-6xl font-editorial text-[#FF5A36] font-normal block">02</span>
              <h3 className="text-2xl font-editorial text-[#111111]">Continuous Market Scan</h3>
              <p className="text-sm text-[#6B6B67] leading-relaxed">
                The agent queries live ATS boards throughout the night, filters out spam, deduplicates company listings, and scores each role's requirements.
              </p>
            </div>

            {/* Numbered Step 3 */}
            <div className="space-y-4 border-t border-[#DDDAD2] pt-6">
              <span className="text-5xl sm:text-6xl font-editorial text-[#111111] font-normal block">03</span>
              <h3 className="text-2xl font-editorial text-[#111111]">10 AM Dispatch & Pipeline Sync</h3>
              <p className="text-sm text-[#6B6B67] leading-relaxed">
                Every morning at 10:00 AM, the agent submits the top 5 approved applications, triggers Telegram alerts, and monitors email replies for interview rounds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. TECHNICAL / DEVELOPER SECTION */}
      <section id="developers" className="py-20 sm:py-28 border-b border-[#DDDAD2] bg-[#FAF9F5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-[#FFE8E1] border border-[#FF5A36]/20 text-[#FF5A36] text-[12px] font-mono font-medium tracking-wide uppercase">
                <Code2 className="w-3.5 h-3.5" />
                <span>Developer Experience & SDKs</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-normal font-editorial tracking-tight text-[#111111]">
                Code-first agent runtime. <br />
                <span className="italic text-[#6B6B67]">Simple SDK, deterministic pipelines.</span>
              </h2>
              <p className="text-sm sm:text-base text-[#6B6B67] leading-relaxed">
                Integrate the autonomous career engine into your local workflows, CI/CD scripts, or custom microservices using our official TypeScript and Python SDKs.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <span className="text-xs font-mono text-[#6B6B67]">v2.4.0 (Latest Stable)</span>
              <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            </div>
          </div>

          {/* Interactive Code Editor Box (Dedicated High-Contrast Dark IDE Surface) */}
          <div className="rounded-xl overflow-hidden border border-[#2B2A27] bg-[#121210] shadow-xl">
            {/* Window Header Bar */}
            <div className="px-4 py-3 bg-[#181816] border-b border-[#2B2A27] flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-4">
                {/* Window Dots */}
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                </div>

                {/* Tab Pill Buttons */}
                <div className="flex items-center gap-1 bg-[#0E0E0C] p-1 rounded-lg border border-[#2B2A27]">
                  {[
                    { id: 'typescript', label: 'TypeScript SDK' },
                    { id: 'python', label: 'Python SDK' },
                    { id: 'cli', label: 'CLI Terminal' },
                    { id: 'rest', label: 'REST cURL' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTabCode(tab.id as any)}
                      className={`px-3 py-1 rounded-md text-xs font-mono transition-all cursor-pointer ${
                        activeTabCode === tab.id
                          ? 'bg-[#2B2A27] text-white font-bold shadow-xs'
                          : 'text-[#94948E] hover:text-white'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Copy Code Snippet Button */}
              <button
                onClick={() => copyToClipboard(codeSnippets[activeTabCode])}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#242421] hover:bg-[#32322D] border border-[#3A3A34] text-xs font-mono text-white transition-all cursor-pointer shadow-xs active:scale-95"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-[#10B981]" /> : <Copy className="w-3.5 h-3.5 text-[#FF5A36]" />}
                <span className="font-semibold">{copiedCode ? 'Copied to Clipboard!' : 'Copy Snippet'}</span>
              </button>
            </div>

            {/* Code Content Area with High-Contrast Syntax Color Formatting */}
            <div className="p-5 sm:p-7 font-mono text-xs sm:text-[13px] leading-relaxed overflow-x-auto bg-[#121210]">
              {activeTabCode === 'typescript' && (
                <pre className="text-[#F4F4F5] space-y-1">
                  <code>
                    <span className="text-[#71717A] italic block">// 1. Initialize Autonomous Agent Runtime</span>
                    <span className="text-[#FF7A59] font-semibold">import</span>{' '}
                    <span className="text-[#67E8F9]">{'{ AgentRuntime, GreenhouseIngestor, GeminiFitEvaluator }'}</span>{' '}
                    <span className="text-[#FF7A59] font-semibold">from</span>{' '}
                    <span className="text-[#34D399]">'@agentengine/sdk'</span>;<br /><br />
                    
                    <span className="text-[#FF7A59] font-semibold">const</span>{' '}
                    <span className="text-[#F4F4F5]">runtime = </span>
                    <span className="text-[#FF7A59] font-semibold">new</span>{' '}
                    <span className="text-[#67E8F9]">AgentRuntime</span>({'{'}<br />
                    {'  '}apiKey: <span className="text-[#93C5FD]">process.env.AGENT_ENGINE_API_KEY</span>,<br />
                    {'  '}model: <span className="text-[#34D399]">'gemini-2.0-flash'</span>,<br />
                    {'  '}memory: <span className="text-[#34D399]">'pgvector://candidate-profile-v2'</span><br />
                    {'}'});<br /><br />

                    <span className="text-[#71717A] italic block">// 2. Register Search & Ingestion Connectors</span>
                    <span className="text-[#F4F4F5]">runtime.</span>
                    <span className="text-[#93C5FD]">use</span>(
                    <span className="text-[#FF7A59] font-semibold">new</span>{' '}
                    <span className="text-[#67E8F9]">GreenhouseIngestor</span>({'{'}{' '}
                    targetRoles: [<span className="text-[#34D399]">'Senior Full Stack'</span>, <span className="text-[#34D399]">'AI Engineer'</span>]{' '}
                    {'}'}));<br /><br />

                    <span className="text-[#71717A] italic block">// 3. Define Reasoning Pipeline & Dispatch</span>
                    <span className="text-[#F4F4F5]">runtime.</span>
                    <span className="text-[#93C5FD]">onCandidateMatch</span>(
                    <span className="text-[#FF7A59] font-semibold">async</span> (job) {'=>'} {'{'}<br />
                    {'  '}<span className="text-[#FF7A59] font-semibold">const</span> fit ={' '}
                    <span className="text-[#FF7A59] font-semibold">await</span>{' '}
                    <span className="text-[#67E8F9]">GeminiFitEvaluator</span>.
                    <span className="text-[#93C5FD]">evaluate</span>(job, candidateResume);<br />
                    {'  '}<span className="text-[#FF7A59] font-semibold">if</span> (fit.score {'>='}{' '}
                    <span className="text-[#FCD34D]">85</span>) {'{'}<br />
                    {'    '}<span className="text-[#FF7A59] font-semibold">const</span> letter ={' '}
                    <span className="text-[#FF7A59] font-semibold">await</span> runtime.
                    <span className="text-[#93C5FD]">synthesizeCoverLetter</span>({'{'} job, citations:{' '}
                    <span className="text-[#FCD34D]">true</span> {'}'});<br />
                    {'    '}<span className="text-[#FF7A59] font-semibold">await</span> runtime.
                    <span className="text-[#93C5FD]">dispatchApplication</span>({'{'} job, letter, humanApproval:{' '}
                    <span className="text-[#FCD34D]">true</span> {'}'});<br />
                    {'  '}{'}'}<br />
                    {'}'});<br /><br />

                    <span className="text-[#FF7A59] font-semibold">await</span> runtime.
                    <span className="text-[#93C5FD]">startDailySchedule</span>({'{'} targetTime:{' '}
                    <span className="text-[#34D399]">'10:00:00Z'</span>, quota:{' '}
                    <span className="text-[#FCD34D]">5</span> {'}'});
                  </code>
                </pre>
              )}

              {activeTabCode === 'python' && (
                <pre className="text-[#F4F4F5] space-y-1">
                  <code>
                    <span className="text-[#71717A] italic block"># 1. Initialize Autonomous Career Runtime</span>
                    <span className="text-[#FF7A59] font-semibold">from</span>{' '}
                    <span className="text-[#67E8F9]">agentengine</span>{' '}
                    <span className="text-[#FF7A59] font-semibold">import</span>{' '}
                    <span className="text-[#67E8F9]">AgentRuntime, MultiBoardIngestor, GeminiScorer</span><br /><br />

                    <span className="text-[#F4F4F5]">agent = </span>
                    <span className="text-[#67E8F9]">AgentRuntime</span>(<br />
                    {'    '}model=<span className="text-[#34D399]">"gemini-2.0-flash"</span>,<br />
                    {'    '}strict_citation=<span className="text-[#FCD34D]">True</span>,<br />
                    {'    '}safety_gate=<span className="text-[#34D399]">"HUMAN_IN_THE_LOOP"</span><br />
                    )<br /><br />

                    <span className="text-[#71717A] italic block"># 2. Ingest Multi-Source Live ATS Streams</span>
                    <span className="text-[#F4F4F5]">jobs = agent.</span>
                    <span className="text-[#93C5FD]">ingest_live_boards</span>([
                    <span className="text-[#34D399]">"remoteok"</span>,{' '}
                    <span className="text-[#34D399]">"lever"</span>,{' '}
                    <span className="text-[#34D399]">"greenhouse"</span>])<br />
                    <span className="text-[#F4F4F5]">matches = agent.</span>
                    <span className="text-[#93C5FD]">score_candidate_fit</span>(jobs, min_score=
                    <span className="text-[#FCD34D]">85</span>)<br /><br />

                    <span className="text-[#71717A] italic block"># 3. Synthesize Bespoke Applications & Queue for 10 AM Dispatch</span>
                    <span className="text-[#FF7A59] font-semibold">for</span> match{' '}
                    <span className="text-[#FF7A59] font-semibold">in</span> matches:<br />
                    {'    '}app_package = agent.<span className="text-[#93C5FD]">synthesize_application</span>(match)<br />
                    {'    '}agent.<span className="text-[#93C5FD]">queue_for_approval</span>(app_package)<br /><br />

                    <span className="text-[#FF7A59] font-semibold">print</span>(
                    <span className="text-[#34D399]">f"✓ {'{len(matches)}'} high-fit applications queued for 10:00 AM dispatch."</span>)
                  </code>
                </pre>
              )}

              {activeTabCode === 'cli' && (
                <pre className="text-[#F4F4F5] space-y-1.5">
                  <code>
                    <span className="text-[#FF5A36] font-bold">$ </span>
                    <span className="text-white font-bold">npx @agentengine/cli scan --sources=all --min-match=85</span><br />
                    <span className="text-[#71717A]">[09:59:52] </span>
                    <span className="text-[#93C5FD]">⠋ Connecting to PostgreSQL vector store...</span><br />
                    <span className="text-[#71717A]">[09:59:53] </span>
                    <span className="text-[#34D399]">✓ Ingested 124 live postings across RemoteOK, Lever, Ashby</span><br />
                    <span className="text-[#71717A]">[09:59:54] </span>
                    <span className="text-[#34D399]">✓ Gemini 2.0 scored 38 roles against candidate resume</span><br />
                    <span className="text-[#71717A]">[09:59:55] </span>
                    <span className="text-[#34D399]">✓ 5 target applications prepared with truthful citations</span><br />
                    <span className="text-[#71717A]">[09:59:56] </span>
                    <span className="text-[#FCD34D] font-semibold">⚡ 10:00 AM Morning Dispatch complete. Telegram push alert sent.</span>
                  </code>
                </pre>
              )}

              {activeTabCode === 'rest' && (
                <pre className="text-[#F4F4F5] space-y-1">
                  <code>
                    <span className="text-[#FF7A59] font-bold">curl</span>{' '}
                    <span className="text-[#93C5FD]">-X POST</span>{' '}
                    <span className="text-[#34D399]">https://api.agentengine.dev/v1/agent/run</span> \<br />
                    {'  '}<span className="text-[#93C5FD]">-H</span>{' '}
                    <span className="text-[#34D399]">"Authorization: Bearer ae_live_79a8bc430e92f..."</span> \<br />
                    {'  '}<span className="text-[#93C5FD]">-H</span>{' '}
                    <span className="text-[#34D399]">"Content-Type: application/json"</span> \<br />
                    {'  '}<span className="text-[#93C5FD]">-d</span> '{'{'}<br />
                    {'    '}<span className="text-[#67E8F9]">"goal"</span>: <span className="text-[#34D399]">"Daily 10:00 AM Auto-Apply Routine"</span>,<br />
                    {'    '}<span className="text-[#67E8F9]">"min_match_score"</span>: <span className="text-[#FCD34D]">85</span>,<br />
                    {'    '}<span className="text-[#67E8F9]">"max_applications"</span>: <span className="text-[#FCD34D]">5</span>,<br />
                    {'    '}<span className="text-[#67E8F9]">"require_human_approval"</span>: <span className="text-[#FCD34D]">true</span>,<br />
                    {'    '}<span className="text-[#67E8F9]">"channels"</span>: [<span className="text-[#34D399]">"telegram"</span>, <span className="text-[#34D399]">"email_digest"</span>]<br />
                    {'  '}{'}'}'
                  </code>
                </pre>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 8. FINAL OVERSIZED CTA */}
      <section className="py-24 sm:py-32 border-b border-[#DDDAD2] text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#FF5A36]">Zero Manual Tedium</span>
          
          <h2 className="text-5xl sm:text-6xl lg:text-[76px] font-normal font-editorial tracking-tight text-[#111111] leading-[1.05]">
            Automate your pipeline. <br />
            <span className="italic text-[#6B6B67]">Never lose an interview opportunity.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#6B6B67] max-w-xl mx-auto leading-relaxed">
            Stop spending hours filling repetitive forms. Let JobAgent AI OS scan, qualify, and prepare your applications every morning.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onLaunchWorkbench('dashboard')}
              className="btn-accent px-8 py-4 text-base font-semibold shadow-md"
            >
              <span>Launch Autonomous Workbench</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onLaunchWorkbench('jobs')}
              className="btn-secondary-outline px-8 py-4 text-base font-semibold"
            >
              <span>Search Live Jobs</span>
            </button>
          </div>

          <p className="text-xs font-mono text-[#6B6B67] pt-2">
            Free & open-source architecture • PostgreSQL + Gemini 2.0 • Human-In-The-Loop Safety Gate
          </p>
        </div>
      </section>

      {/* 9. MINIMAL FOOTER */}
      <footer className="py-14 bg-[#FAF9F5] text-xs text-[#6B6B67] font-['Geist',sans-serif]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-8 pb-12 border-b border-[#DDDAD2]">
            {/* Col 1 */}
            <div className="col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-[#111111] flex items-center justify-center text-white">
                  <Bot className="w-3.5 h-3.5 text-[#FF5A36]" />
                </div>
                <span className="font-editorial text-lg text-[#111111]">JobAgent AI OS</span>
              </div>
              <p className="text-xs text-[#6B6B67] max-w-sm leading-relaxed">
                Deterministic autonomous job search, resume fit scoring, cover letter synthesis, and recruiter email monitoring.
              </p>
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#111111] pt-2">
                <span className="w-2 h-2 rounded-full bg-[#FF5A36]" />
                <span>All Runtime Systems Operational</span>
              </div>
            </div>

            {/* Col 2 */}
            <div className="space-y-2.5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#111111] font-semibold block">Product</span>
              <ul className="space-y-2">
                <li><button onClick={() => onLaunchWorkbench('dashboard')} className="hover:text-[#111111] transition-colors">Dashboard</button></li>
                <li><button onClick={() => onLaunchWorkbench('jobs')} className="hover:text-[#111111] transition-colors">Job Search</button></li>
                <li><button onClick={() => onLaunchWorkbench('applications')} className="hover:text-[#111111] transition-colors">Pipeline Kanban</button></li>
                <li><button onClick={() => onLaunchWorkbench('agent')} className="hover:text-[#111111] transition-colors">Agent Console</button></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="space-y-2.5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#111111] font-semibold block">Tools</span>
              <ul className="space-y-2">
                <li><button onClick={() => onLaunchWorkbench('cover-letters')} className="hover:text-[#111111] transition-colors">Cover Letter Studio</button></li>
                <li><button onClick={() => onLaunchWorkbench('email-monitor')} className="hover:text-[#111111] transition-colors">Email Classifier</button></li>
                <li><button onClick={() => onLaunchWorkbench('profile')} className="hover:text-[#111111] transition-colors">Resume Profile</button></li>
                <li><button onClick={() => onLaunchWorkbench('settings')} className="hover:text-[#111111] transition-colors">10 AM Scheduler</button></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div className="space-y-2.5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#111111] font-semibold block">Architecture</span>
              <ul className="space-y-2">
                <li><a href="#developers" className="hover:text-[#111111] transition-colors">TypeScript SDK</a></li>
                <li><a href="#developers" className="hover:text-[#111111] transition-colors">Gemini 2.0 Integration</a></li>
                <li><a href="#developers" className="hover:text-[#111111] transition-colors">REST Webhooks</a></li>
                <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[#111111] transition-colors">GitHub Repository</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-[#6B6B67]">
            <p>© 2026 JobAgent Autonomous Systems. Built for high-leverage careers.</p>
            <div className="flex items-center gap-4">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Security</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
