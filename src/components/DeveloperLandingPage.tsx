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
  Clock,
  Activity,
  CheckCircle
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
    totalApplications: 12,
    newMatchesCount: 38,
    interviewCount: 2,
    averageMatchScore: 94,
  }
}) => {
  const [activeTabCode, setActiveTabCode] = useState<'typescript' | 'python' | 'cli' | 'rest'>('typescript');
  const [copiedCode, setCopiedCode] = useState(false);
  const [simRunning, setSimRunning] = useState(false);
  const [activeStepPreview, setActiveStepPreview] = useState(0);
  const [islandView, setIslandView] = useState<DynamicIslandView>('idle');

  const codeSnippets = {
    typescript: `import { AgentRuntime, GreenhouseIngestor, GeminiFitEvaluator } from '@kinetic/sdk';

// 1. Initialize Autonomous Agent
const runtime = new AgentRuntime({
  apiKey: process.env.KINETIC_API_KEY,
  model: 'gemini-2.0-flash',
  memory: 'pgvector://candidate-profile-v2'
});

// 2. Register Search & Ingestion Connectors (Node.js/Backend Focus)
runtime.use(new GreenhouseIngestor({ targetRoles: ['Backend Software Engineer', 'Distributed Systems'] }));

// 3. Define Reasoning Pipeline & Dispatch
runtime.onCandidateMatch(async (job) => {
  const fit = await GeminiFitEvaluator.evaluate(job, candidateResume);
  if (fit.score >= 85) {
    const letter = await runtime.synthesizeCoverLetter({ job, citations: true });
    await runtime.dispatchApplication({ job, letter, humanApproval: true });
  }
});

await runtime.startDailySchedule({ targetTime: '10:00:00Z', quota: 5 });`,
    python: `from kinetic import AgentRuntime, MultiBoardIngestor, GeminiScorer

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
    cli: `$ npx @kinetic/cli scan --sources=all --min-match=85
[09:59:52] ⠋ Connecting to PostgreSQL vector store...
[09:59:53] ✓ Ingested 124 live postings across RemoteOK, Lever, Ashby
[09:59:54] ✓ Gemini 2.0 scored 38 roles against candidate resume (Pankaj Kumar)
[09:59:55] ✓ 5 target applications prepared with truthful citations
[09:59:56] ⚡ 10:00 AM Morning Dispatch complete. Telegram alert sent.`,
    rest: `curl -X POST https://api.kinetic.dev/v1/agent/run \\
  -H "Authorization: Bearer kn_live_79a8bc430e..." \\
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
    <div className="min-h-screen bg-[#070709] text-[#FFFFFF] font-['Geist',sans-serif] selection:bg-[#FF5A36]/30 selection:text-[#FF5A36] relative">
      {/* Background Subtle Gradient Aura */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-[#FF5A36]/5 via-transparent to-transparent pointer-events-none -z-10" />

      {/* 1. HERO SECTION (Exact Match to Laptop Screen Reference) */}
      <section className="pt-16 pb-16 sm:pt-24 sm:pb-20 border-b border-[#1D1D24] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl space-y-6">
            {/* Monospace Glowing Eyebrow Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#16161E] border border-[#FF5A36]/40 text-[#FF5A36] text-[11px] font-mono font-semibold tracking-wider uppercase shadow-[0_0_15px_rgba(255,90,54,0.15)]">
              <span className="w-2 h-2 rounded-full bg-[#FF5A36] animate-pulse" />
              <span>AUTONOMOUS CAREER OPERATING SYSTEM</span>
            </div>

            {/* Massive Display Headline */}
            <h1 className="text-5xl sm:text-7xl lg:text-[84px] font-display font-extrabold tracking-tight leading-[1.04] text-[#FFFFFF]">
              Build your <span className="font-serif-italic font-normal text-[#E2E2EC]">workflow.</span> <br />
              Track every <span className="bg-gradient-to-r from-[#FF5A36] via-[#FF7A59] to-[#FFA07A] bg-clip-text text-transparent">opportunity.</span>
            </h1>

            {/* Personalized Pankaj Kumar Copy */}
            <p className="text-base sm:text-lg text-[#8E8E9B] max-w-3xl leading-relaxed font-normal">
              Autonomous job-search engine tailored for <strong className="text-[#FFFFFF] font-semibold">Pankaj Kumar</strong> (Backend Software Engineer). Scrapes live Node.js/Backend roles from verified ATS pipelines, tailors resumes with Vync &amp; Coron project highlights, and dispatches instant Telegram alerts + scheduled morning digests.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-3">
              <button
                onClick={() => onLaunchWorkbench('dashboard')}
                className="btn-accent px-7 py-3.5 text-[15px] font-semibold flex items-center gap-2 shadow-lg shadow-[#FF5A36]/25 hover:shadow-[#FF5A36]/40 transition-all cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-current text-white" />
                <span>Explore Workflow Engine</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => onLaunchWorkbench('agent')}
                className="px-6 py-3.5 rounded-full bg-[#111116] border border-[#1D1D24] text-[#FFFFFF] hover:border-[#2D2D38] hover:bg-[#16161E] text-[15px] font-medium flex items-center gap-2 transition-all cursor-pointer"
              >
                <Terminal className="w-4 h-4 text-[#8E8E9B]" />
                <span>View Live Execution Logs</span>
              </button>
            </div>
          </div>

          {/* 4 Bento Metric Cards (Matching Screen Photo) */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: ACTIVE APPLICATIONS */}
            <div className="p-5 rounded-2xl bg-[#111116] border border-[#1D1D24] space-y-3 relative overflow-hidden group hover:border-[#2D2D38] transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#8E8E9B]">ACTIVE APPLICATIONS</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#16161E] border border-[#1D1D24] text-[#8E8E9B]">
                  NODE.JS
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-display font-bold text-[#FFFFFF]">
                {stats.totalApplications || 12}
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#00FF88]">
                <CheckCircle className="w-3.5 h-3.5" />
                <span>+4 new applied today</span>
              </div>
            </div>

            {/* Card 2: INTERVIEWS SCHEDULED */}
            <div className="p-5 rounded-2xl bg-[#111116] border border-[#1D1D24] space-y-3 relative overflow-hidden group hover:border-[#2D2D38] transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#8E8E9B]">INTERVIEWS SCHEDULED</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#16161E] border border-[#1D1D24] text-[#8E8E9B]">
                  PIPELINE
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-[#FFFFFF] truncate">
                Postman &amp; Stripe
              </div>
              <div className="text-xs font-mono text-[#8E8E9B] truncate">
                Next round: System Design
              </div>
            </div>

            {/* Card 3: DAILY APPLICATION QUOTA */}
            <div className="p-5 rounded-2xl bg-[#111116] border border-[#1D1D24] space-y-3 relative overflow-hidden group hover:border-[#2D2D38] transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#8E8E9B]">DAILY APPLICATION QUOTA</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#00FF88]/10 border border-[#00FF88]/30 text-[#00FF88]">
                  ACTIVE
                </span>
              </div>
              <div className="text-2xl sm:text-3xl font-display font-bold text-[#FFFFFF]">
                0/3 Daily Applied
              </div>
              <div className="flex items-center gap-1.5 text-xs font-mono text-[#00FF88]">
                <Clock className="w-3.5 h-3.5" />
                <span>Scheduled: 10:00 AM IST</span>
              </div>
            </div>

            {/* Card 4: TELEGRAM ALERTS */}
            <div className="p-5 rounded-2xl bg-[#111116] border border-[#1D1D24] space-y-3 relative overflow-hidden group hover:border-[#2D2D38] transition-all">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono uppercase tracking-wider text-[#8E8E9B]">TELEGRAM ALERTS</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-medium bg-[#16161E] border border-[#1D1D24] text-[#8E8E9B]">
                  VERIFIED
                </span>
              </div>
              <div className="text-3xl sm:text-4xl font-display font-bold text-[#00FF88]">
                Connected
              </div>
              <div className="text-xs font-mono text-[#8E8E9B]">
                Chat: 1276866292
              </div>
            </div>
          </div>

          {/* Hero Technical Product Visualization: Dynamic Island & Terminal Trace */}
          <div className="mt-10 pt-8 border-t border-[#1D1D24]">
            <div className="rounded-2xl bg-[#111116] border border-[#1D1D24] overflow-hidden shadow-2xl">
              {/* Terminal Window Bar */}
              <div className="px-4 py-3 bg-[#0D0D12] border-b border-[#1D1D24] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F56]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#FFBD2E]" />
                  <div className="w-2.5 h-2.5 rounded-full bg-[#27C93F]" />
                  <span className="text-xs font-mono text-[#8E8E9B] ml-2">kinetic-runtime — v2.4.0 (active)</span>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-xs font-mono text-[#8E8E9B]">
                    <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
                    <span>DAILY TARGET: 10:00 AM</span>
                  </div>
                  <button
                    onClick={handleRunSim}
                    disabled={simRunning}
                    className="px-3 py-1 rounded-lg bg-[#16161E] border border-[#1D1D24] text-[11px] font-mono text-[#FFFFFF] hover:border-[#FF5A36] transition-all disabled:opacity-50 cursor-pointer"
                  >
                    {simRunning ? 'Executing Loop...' : 'Trigger Simulation'}
                  </button>
                </div>
              </div>

              {/* Kinetic Live Telemetry Dynamic Island HUD */}
              <div className="py-7 px-4 bg-[#0A0A0E] border-b border-[#1D1D24] flex flex-col items-center justify-center">
                <div className="text-center mb-3">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-[#8E8E9B]">
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
              <div className="grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#1D1D24] bg-[#0D0D12]">
                {/* Left 7 Cols: Real-Time Execution Trace */}
                <div className="lg:col-span-7 p-5 sm:p-6 space-y-4 font-mono text-xs">
                  <div className="flex items-center justify-between text-[#8E8E9B] border-b border-[#1D1D24] pb-2 text-[11px]">
                    <span>REASONING EXECUTION LOG</span>
                    <span className="text-[#00FF88]">LATENCY: 480ms</span>
                  </div>

                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                    <div className="flex items-start gap-2 text-[#8E8E9B]">
                      <span className="text-[#FF5A36]">[09:59:58]</span>
                      <span>Ingesting multi-source endpoints (RemoteOK, Lever, Ashby, Greenhouse)...</span>
                    </div>

                    <div className="flex items-start gap-2 text-[#FFFFFF]">
                      <span className="text-[#FF5A36]">[10:00:01]</span>
                      <span>✓ 142 jobs discovered. 47 candidates deduplicated.</span>
                    </div>

                    <div className="flex items-start gap-2 text-[#FFFFFF]">
                      <span className="text-[#FF5A36]">[10:00:02]</span>
                      <span>→ Executing Gemini 2.0 Fit Scorer against candidate resume (Pankaj Kumar).</span>
                    </div>

                    <div className="p-3 rounded-lg bg-[#111116] border border-[#1D1D24] space-y-1.5 text-[11px]">
                      <div className="flex items-center justify-between text-[#FFFFFF] font-semibold">
                        <span>Staff Distributed Systems Engineer @ Stripe</span>
                        <span className="text-[#00FF88] font-bold">94% Match</span>
                      </div>
                      <p className="text-[#8E8E9B] font-sans">
                        Reason: 6+ yrs Node.js, Go &amp; Kafka experience directly aligns with primary ledger infrastructure requirements. Cites Vync &amp; Coron architectures.
                      </p>
                    </div>

                    <div className="flex items-start gap-2 text-[#FFFFFF]">
                      <span className="text-[#FF5A36]">[10:00:04]</span>
                      <span>✓ Synthesized bespoke cover letter citing verified past transactions metrics.</span>
                    </div>

                    <div className="flex items-start gap-2 text-[#00FF88]">
                      <span className="text-[#FF5A36]">[10:00:05]</span>
                      <span>⚡ Human-In-The-Loop approval gate passed. 5 target applications dispatched.</span>
                    </div>
                  </div>
                </div>

                {/* Right 5 Cols: Live Metric & Candidate Fit Status */}
                <div className="lg:col-span-5 p-5 sm:p-6 space-y-5 bg-[#111116]">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono uppercase tracking-wider text-[#8E8E9B]">Pipeline Telemetry</span>
                    <span className="text-xs font-mono text-[#00FF88] bg-[#00FF88]/10 border border-[#00FF88]/30 px-2 py-0.5 rounded">
                      ALL SYSTEMS HEALTHY
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-xl bg-[#0D0D12] border border-[#1D1D24] space-y-1">
                      <span className="text-[11px] font-mono text-[#8E8E9B] block">Active Matches</span>
                      <span className="text-2xl font-display font-bold text-[#FFFFFF]">{stats.newMatchesCount || 38}</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#0D0D12] border border-[#1D1D24] space-y-1">
                      <span className="text-[11px] font-mono text-[#8E8E9B] block">Avg AI Fit</span>
                      <span className="text-2xl font-display font-bold text-[#FF5A36]">{stats.averageMatchScore || 94}%</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#0D0D12] border border-[#1D1D24] space-y-1">
                      <span className="text-[11px] font-mono text-[#8E8E9B] block">Submitted</span>
                      <span className="text-2xl font-display font-bold text-[#FFFFFF]">{stats.totalApplications || 12}</span>
                    </div>
                    <div className="p-3.5 rounded-xl bg-[#0D0D12] border border-[#1D1D24] space-y-1">
                      <span className="text-[11px] font-mono text-[#8E8E9B] block">Interviews</span>
                      <span className="text-2xl font-display font-bold text-[#00FF88]">{stats.interviewCount || 2}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => onLaunchWorkbench('dashboard')}
                    className="w-full py-3 px-4 rounded-xl bg-[#16161E] hover:bg-[#1E1E28] border border-[#1D1D24] text-[#FFFFFF] text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
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

      {/* 2. TRUST & SOCIAL PROOF */}
      <section className="py-12 border-b border-[#1D1D24] bg-[#0A0A0E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-xs font-mono uppercase tracking-[0.2em] text-[#8E8E9B] text-center mb-8">
            Engineered on trusted developer and AI infrastructure
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 items-center justify-items-center opacity-80 hover:opacity-100 transition-all text-xs font-mono text-[#FFFFFF]">
            <div className="flex items-center gap-2 font-semibold">
              <span className="p-1 rounded bg-[#16161E] border border-[#1D1D24] text-[#FF5A36]">YC</span>
              <span>ALUMNI BACKED</span>
            </div>
            <div className="flex items-center gap-2 font-semibold">
              <Database className="w-4 h-4 text-[#8E8E9B]" />
              <span>PGVECTOR</span>
            </div>
            <div className="flex items-center gap-2 font-semibold">
              <Zap className="w-4 h-4 text-[#FF5A36]" />
              <span>GEMINI 2.0 FLASH</span>
            </div>
            <div className="flex items-center gap-2 font-semibold">
              <Globe className="w-4 h-4 text-[#8E8E9B]" />
              <span>GREENHOUSE API</span>
            </div>
            <div className="flex items-center gap-2 font-semibold">
              <Layers className="w-4 h-4 text-[#8E8E9B]" />
              <span>LEVER CONNECTOR</span>
            </div>
            <div className="flex items-center gap-2 font-semibold">
              <Terminal className="w-4 h-4 text-[#8E8E9B]" />
              <span>TYPESCRIPT SDK</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. PRODUCT SECTION (Workflow & Architecture) */}
      <section id="product" className="py-20 sm:py-28 border-b border-[#1D1D24]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="max-w-3xl space-y-4">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#FF5A36]">Core Product Workflow</span>
            <h2 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-[#FFFFFF] leading-[1.1]">
              A complete runtime for deterministic job hunting.
            </h2>
            <p className="text-[#8E8E9B] text-base leading-relaxed">
              Replace manual form-filling with an agent loop that runs in the background, scores every requirement against your proven track record, and generates tailored cover letters.
            </p>
          </div>

          {/* Interactive 3-Panel Visual Workflow */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 Card */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#111116] border border-[#1D1D24] space-y-4 flex flex-col justify-between hover:border-[#2D2D38] transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#FF5A36] font-bold">STAGE 01</span>
                  <Search className="w-4 h-4 text-[#8E8E9B]" />
                </div>
                <h3 className="text-xl font-display font-bold text-[#FFFFFF]">Multi-Source Ingestion</h3>
                <p className="text-sm text-[#8E8E9B] leading-relaxed">
                  Connects directly to RemoteOK, Arbeitnow, Greenhouse, Lever, and custom URL parsers to ingest clean job payloads without spam or duplicate postings.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0D0D12] border border-[#1D1D24] text-xs font-mono text-[#8E8E9B] space-y-1.5">
                <div className="flex justify-between">
                  <span>Greenhouse API</span>
                  <span className="text-[#00FF88]">✓ Synced</span>
                </div>
                <div className="flex justify-between">
                  <span>Lever Webhooks</span>
                  <span className="text-[#00FF88]">✓ Synced</span>
                </div>
                <div className="flex justify-between">
                  <span>RemoteOK Feed</span>
                  <span className="text-[#00FF88]">✓ Synced</span>
                </div>
              </div>
            </div>

            {/* Step 2 Card */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#111116] border border-[#1D1D24] space-y-4 flex flex-col justify-between hover:border-[#2D2D38] transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#FF5A36] font-bold">STAGE 02</span>
                  <Cpu className="w-4 h-4 text-[#FF5A36]" />
                </div>
                <h3 className="text-xl font-display font-bold text-[#FFFFFF]">Multi-Factor Match Scoring</h3>
                <p className="text-sm text-[#8E8E9B] leading-relaxed">
                  Evaluates candidate experience, tech stack depth, compensation range, and location preferences against the job description with verifiable citations.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0D0D12] border border-[#1D1D24] text-xs font-mono space-y-2">
                <div className="flex justify-between text-[#FFFFFF] font-semibold">
                  <span>Fit Score Threshold</span>
                  <span className="text-[#FF5A36]">85%+ Minimum</span>
                </div>
                <div className="w-full bg-[#1D1D24] h-1.5 rounded-full overflow-hidden">
                  <div className="bg-[#FF5A36] h-full rounded-full w-[94%]" />
                </div>
                <span className="text-[10px] text-[#8E8E9B] block">Strict zero-hallucination policy enabled</span>
              </div>
            </div>

            {/* Step 3 Card */}
            <div className="p-6 sm:p-7 rounded-2xl bg-[#111116] border border-[#1D1D24] space-y-4 flex flex-col justify-between hover:border-[#2D2D38] transition-all">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#FF5A36] font-bold">STAGE 03</span>
                  <Send className="w-4 h-4 text-[#8E8E9B]" />
                </div>
                <h3 className="text-xl font-display font-bold text-[#FFFFFF]">10:00 AM Morning Dispatch</h3>
                <p className="text-sm text-[#8E8E9B] leading-relaxed">
                  Applies to 5+ qualified positions each morning, notifies candidate via Telegram, and monitors inbound recruiter emails for interview scheduling.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0D0D12] border border-[#1D1D24] text-xs font-mono text-[#8E8E9B] space-y-1.5">
                <div className="flex justify-between">
                  <span>Morning Target</span>
                  <span className="text-[#FFFFFF]">10:00:00 AM</span>
                </div>
                <div className="flex justify-between">
                  <span>Telegram Alerts</span>
                  <span className="text-[#00FF88]">Instant Push</span>
                </div>
                <div className="flex justify-between">
                  <span>Recruiter Classifier</span>
                  <span className="text-[#FFFFFF]">Auto-Triage</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. ASYMMETRIC FEATURES SECTION */}
      <section id="features" className="py-20 sm:py-28 border-b border-[#1D1D24] bg-[#0A0A0E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="max-w-2xl space-y-3">
              <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#FF5A36]">Feature Breakdown</span>
              <h2 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-[#FFFFFF]">
                Built like developer tools. <br />
                <span className="text-[#8E8E9B] font-normal">Not marketing fluff.</span>
              </h2>
            </div>

            <button
              onClick={() => onLaunchWorkbench('jobs')}
              className="px-5 py-2.5 rounded-full bg-[#111116] border border-[#1D1D24] text-xs font-semibold text-[#FFFFFF] hover:border-[#2D2D38] transition-all self-start sm:self-auto flex items-center gap-1.5 cursor-pointer"
            >
              <span>Explore Live Job Feed</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Asymmetric Bento Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Feature 1: Large 8-col card */}
            <div className="lg:col-span-8 p-7 sm:p-8 rounded-2xl bg-[#111116] border border-[#1D1D24] space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#8E8E9B] uppercase tracking-wider">01 / REASONING ENGINE</span>
                <span className="px-2.5 py-0.5 rounded bg-[#FF5A36]/15 border border-[#FF5A36]/30 text-[#FF5A36] text-xs font-mono font-semibold">
                  GEMINI 2.0 FLASH
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-display font-bold text-[#FFFFFF]">Verifiable Cover Letters &amp; Custom Q&amp;A</h3>
                <p className="text-sm text-[#8E8E9B] leading-relaxed max-w-xl">
                  Unlike generic GPT wrappers that hallucinate fake achievements, Kinetic is constrained to cite real historical projects, GitHub repositories, and verified engineering metrics from your parsed candidate profile.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#0D0D12] border border-[#1D1D24] font-mono text-xs text-[#FFFFFF] space-y-2">
                <div className="flex items-center gap-2 text-[#FF5A36] text-[11px] font-bold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>GROUNDED CITATION SAMPLE:</span>
                </div>
                <p className="text-[#8E8E9B] font-sans text-xs italic">
                  "In my previous projects (Vync &amp; Coron), I reduced high-concurrency p99 latency from 1.4s to 120ms by migrating Postgres queues to Redis streams—directly solving the scaling challenge noted in your job description."
                </p>
              </div>
            </div>

            {/* Feature 2: 4-col card */}
            <div className="lg:col-span-4 p-7 sm:p-8 rounded-2xl bg-[#111116] border border-[#1D1D24] space-y-6 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-mono text-[#8E8E9B] uppercase tracking-wider">02 / RECRUITER TRIAGE</span>
                <h3 className="text-2xl font-display font-bold text-[#FFFFFF]">Inbound Email Classifier</h3>
                <p className="text-xs text-[#8E8E9B] leading-relaxed">
                  Monitors recruiter responses, classifies interview requests vs. rejections, and auto-syncs Kanban stages in real time.
                </p>
              </div>

              <div className="space-y-2 pt-4 border-t border-[#1D1D24] text-xs font-mono">
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0D0D12] border border-[#1D1D24]">
                  <span className="text-[#FFFFFF]">Interview Invite</span>
                  <span className="text-[#00FF88] font-bold">Auto-Stage</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#0D0D12] border border-[#1D1D24]">
                  <span className="text-[#8E8E9B]">Rejection Notice</span>
                  <span className="text-[#8E8E9B]">Auto-Archive</span>
                </div>
              </div>
            </div>

            {/* Feature 3: 4-col card */}
            <div className="lg:col-span-4 p-7 sm:p-8 rounded-2xl bg-[#111116] border border-[#1D1D24] space-y-6 flex flex-col justify-between">
              <div className="space-y-3">
                <span className="text-xs font-mono text-[#8E8E9B] uppercase tracking-wider">03 / SAFETY CONTROLS</span>
                <h3 className="text-2xl font-display font-bold text-[#FFFFFF]">Human-In-The-Loop</h3>
                <p className="text-xs text-[#8E8E9B] leading-relaxed">
                  Every cover letter, resume variant, and custom portal answer is staged in an approval queue before any submission payload is dispatched.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0D0D12] border border-[#1D1D24] text-xs font-mono space-y-1.5">
                <span className="text-[#FFFFFF] font-semibold block">Safety Guarantees:</span>
                <span className="text-[#8E8E9B] text-[11px] block">✓ Salary floor enforcement ($140k+)</span>
                <span className="text-[#8E8E9B] text-[11px] block">✓ Remote-only strict verification</span>
                <span className="text-[#8E8E9B] text-[11px] block">✓ No duplicate submissions</span>
              </div>
            </div>

            {/* Feature 4: 8-col card */}
            <div className="lg:col-span-8 p-7 sm:p-8 rounded-2xl bg-[#111116] border border-[#1D1D24] space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-[#8E8E9B] uppercase tracking-wider">04 / NOTIFICATIONS &amp; SYNC</span>
                <span className="text-xs font-mono text-[#00FF88]">TELEGRAM + GMAIL</span>
              </div>

              <div className="space-y-2">
                <h3 className="text-2xl font-display font-bold text-[#FFFFFF]">Instant Telegram Alerts &amp; HTML Morning Digest</h3>
                <p className="text-sm text-[#8E8E9B] leading-relaxed max-w-xl">
                  Receive instant Telegram messages whenever a strong fit is identified or an interview invitation is detected, plus an executive morning summary with direct approval buttons.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
                <div className="p-3.5 rounded-xl bg-[#0D0D12] border border-[#1D1D24]">
                  <span className="text-[#FFFFFF] font-semibold block">Telegram Bot Push</span>
                  <span className="text-[#8E8E9B] text-[11px]">Real-time application status &amp; quick approve CTAs</span>
                </div>
                <div className="p-3.5 rounded-xl bg-[#0D0D12] border border-[#1D1D24]">
                  <span className="text-[#FFFFFF] font-semibold block">Morning Gmail Digest</span>
                  <span className="text-[#8E8E9B] text-[11px]">HTML summary of all 5 jobs submitted at 10 AM</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS (3-Step Numbered Architecture) */}
      <section id="how-it-works" className="py-20 sm:py-28 border-b border-[#1D1D24]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="max-w-2xl space-y-3">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#FF5A36]">Step-By-Step Architecture</span>
            <h2 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-[#FFFFFF]">
              How the Autonomous Agent executes every day.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Numbered Step 1 */}
            <div className="space-y-4 border-t border-[#1D1D24] pt-6">
              <span className="text-5xl sm:text-6xl font-display font-extrabold text-[#1D1D24] group-hover:text-[#FF5A36] block">01</span>
              <h3 className="text-xl font-display font-bold text-[#FFFFFF]">Parse &amp; Vectorize Resume</h3>
              <p className="text-sm text-[#8E8E9B] leading-relaxed">
                Upload your existing PDF or markdown resume. The parser extracts tech stacks, milestone achievements, years of experience, and target salary requirements.
              </p>
            </div>

            {/* Numbered Step 2 */}
            <div className="space-y-4 border-t border-[#1D1D24] pt-6">
              <span className="text-5xl sm:text-6xl font-display font-extrabold text-[#FF5A36] block">02</span>
              <h3 className="text-xl font-display font-bold text-[#FFFFFF]">Continuous Market Scan</h3>
              <p className="text-sm text-[#8E8E9B] leading-relaxed">
                The agent queries live ATS boards throughout the night, filters out spam, deduplicates company listings, and scores each role's requirements.
              </p>
            </div>

            {/* Numbered Step 3 */}
            <div className="space-y-4 border-t border-[#1D1D24] pt-6">
              <span className="text-5xl sm:text-6xl font-display font-extrabold text-[#00FF88] block">03</span>
              <h3 className="text-xl font-display font-bold text-[#FFFFFF]">10 AM Dispatch &amp; Pipeline Sync</h3>
              <p className="text-sm text-[#8E8E9B] leading-relaxed">
                Every morning at 10:00 AM, the agent submits the top 5 approved applications, triggers Telegram alerts, and monitors email replies for interview rounds.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. TECHNICAL / DEVELOPER SECTION (High Contrast Dark IDE Surface) */}
      <section id="developers" className="py-20 sm:py-28 border-b border-[#1D1D24] bg-[#0A0A0E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div className="max-w-2xl space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#16161E] border border-[#1D1D24] text-[#FF5A36] text-[12px] font-mono font-medium tracking-wide uppercase">
                <Code2 className="w-3.5 h-3.5" />
                <span>Developer Experience &amp; SDKs</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-display font-bold tracking-tight text-[#FFFFFF]">
                Code-first agent runtime. <br />
                <span className="text-[#8E8E9B] font-normal">Simple SDK, deterministic pipelines.</span>
              </h2>
              <p className="text-sm sm:text-base text-[#8E8E9B] leading-relaxed">
                Integrate the autonomous career engine into your local workflows, CI/CD scripts, or custom microservices using our official TypeScript and Python SDKs.
              </p>
            </div>

            <div className="flex items-center gap-3 self-start sm:self-auto">
              <span className="text-xs font-mono text-[#8E8E9B]">v2.4.0 (Latest Stable)</span>
              <div className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
            </div>
          </div>

          {/* Interactive Code Editor Box */}
          <div className="rounded-2xl overflow-hidden border border-[#1D1D24] bg-[#0D0D12] shadow-2xl">
            {/* Window Header Bar */}
            <div className="px-4 py-3 bg-[#111116] border-b border-[#1D1D24] flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-4">
                {/* Window Dots */}
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                  <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                  <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                </div>

                {/* Tab Pill Buttons */}
                <div className="flex items-center gap-1 bg-[#070709] p-1 rounded-lg border border-[#1D1D24]">
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
                          ? 'bg-[#1D1D24] text-[#FFFFFF] font-bold shadow-xs'
                          : 'text-[#8E8E9B] hover:text-[#FFFFFF]'
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
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#16161E] hover:bg-[#1E1E28] border border-[#1D1D24] text-xs font-mono text-white transition-all cursor-pointer shadow-xs active:scale-95"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-[#00FF88]" /> : <Copy className="w-3.5 h-3.5 text-[#FF5A36]" />}
                <span className="font-semibold">{copiedCode ? 'Copied!' : 'Copy Snippet'}</span>
              </button>
            </div>

            {/* Code Content Area */}
            <div className="p-5 sm:p-7 font-mono text-xs sm:text-[13px] leading-relaxed overflow-x-auto bg-[#0D0D12]">
              {activeTabCode === 'typescript' && (
                <pre className="text-[#F4F4F5] space-y-1">
                  <code>
                    <span className="text-[#71717A] italic block">// 1. Initialize Autonomous Agent Runtime</span>
                    <span className="text-[#FF7A59] font-semibold">import</span>{' '}
                    <span className="text-[#67E8F9]">{'{ AgentRuntime, GreenhouseIngestor, GeminiFitEvaluator }'}</span>{' '}
                    <span className="text-[#FF7A59] font-semibold">from</span>{' '}
                    <span className="text-[#34D399]">'@kinetic/sdk'</span>;<br /><br />
                    
                    <span className="text-[#FF7A59] font-semibold">const</span>{' '}
                    <span className="text-[#F4F4F5]">runtime = </span>
                    <span className="text-[#FF7A59] font-semibold">new</span>{' '}
                    <span className="text-[#67E8F9]">AgentRuntime</span>({'{'}<br />
                    {'  '}apiKey: <span className="text-[#93C5FD]">process.env.KINETIC_API_KEY</span>,<br />
                    {'  '}model: <span className="text-[#34D399]">'gemini-2.0-flash'</span>,<br />
                    {'  '}memory: <span className="text-[#34D399]">'pgvector://candidate-profile-v2'</span><br />
                    {'}'});<br /><br />

                    <span className="text-[#71717A] italic block">// 2. Register Search &amp; Ingestion Connectors (Node.js/Backend)</span>
                    <span className="text-[#F4F4F5]">runtime.</span>
                    <span className="text-[#93C5FD]">use</span>(
                    <span className="text-[#FF7A59] font-semibold">new</span>{' '}
                    <span className="text-[#67E8F9]">GreenhouseIngestor</span>({'{'}{' '}
                    targetRoles: [<span className="text-[#34D399]">'Backend Software Engineer'</span>, <span className="text-[#34D399]">'Distributed Systems'</span>]{' '}
                    {'}'}));<br /><br />

                    <span className="text-[#71717A] italic block">// 3. Define Reasoning Pipeline &amp; Dispatch</span>
                    <span className="text-[#F4F4F5]">runtime.</span>
                    <span className="text-[#93C5FD]">onCandidateMatch</span>(
                    <span className="text-[#FF7A59] font-semibold">async</span> (job) {'=>'} {'{'}<br />
                    {'  '}<span className="text-[#FF7A59] font-semibold">const fit = </span>
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
                    <span className="text-[#67E8F9]">kinetic</span>{' '}
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

                    <span className="text-[#71717A] italic block"># 3. Synthesize Bespoke Applications &amp; Queue for 10 AM Dispatch</span>
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
                    <span className="text-white font-bold">npx @kinetic/cli scan --sources=all --min-match=85</span><br />
                    <span className="text-[#71717A]">[09:59:52] </span>
                    <span className="text-[#93C5FD]">⠋ Connecting to PostgreSQL vector store...</span><br />
                    <span className="text-[#71717A]">[09:59:53] </span>
                    <span className="text-[#34D399]">✓ Ingested 124 live postings across RemoteOK, Lever, Ashby</span><br />
                    <span className="text-[#71717A]">[09:59:54] </span>
                    <span className="text-[#34D399]">✓ Gemini 2.0 scored 38 roles against candidate resume (Pankaj Kumar)</span><br />
                    <span className="text-[#71717A]">[09:59:55] </span>
                    <span className="text-[#34D399]">✓ 5 target applications prepared with truthful citations</span><br />
                    <span className="text-[#71717A]">[09:59:56] </span>
                    <span className="text-[#00FF88] font-semibold">⚡ 10:00 AM Morning Dispatch complete. Telegram push alert sent.</span>
                  </code>
                </pre>
              )}

              {activeTabCode === 'rest' && (
                <pre className="text-[#F4F4F5] space-y-1">
                  <code>
                    <span className="text-[#FF7A59] font-bold">curl</span>{' '}
                    <span className="text-[#93C5FD]">-X POST</span>{' '}
                    <span className="text-[#34D399]">https://api.kinetic.dev/v1/agent/run</span> \<br />
                    {'  '}<span className="text-[#93C5FD]">-H</span>{' '}
                    <span className="text-[#34D399]">"Authorization: Bearer kn_live_79a8bc430e92f..."</span> \<br />
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

      {/* 7. FINAL OVERSIZED CTA */}
      <section className="py-24 sm:py-32 border-b border-[#1D1D24] text-center relative overflow-hidden">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-[#FF5A36]">Zero Manual Tedium</span>
          
          <h2 className="text-5xl sm:text-6xl lg:text-[76px] font-display font-extrabold tracking-tight text-[#FFFFFF] leading-[1.05]">
            Automate your pipeline. <br />
            <span className="font-serif-italic font-normal text-[#E2E2EC]">Never lose an interview opportunity.</span>
          </h2>

          <p className="text-base sm:text-lg text-[#8E8E9B] max-w-xl mx-auto leading-relaxed">
            Stop spending hours filling repetitive forms. Let Kinetic scan, qualify, and prepare your applications every morning.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <button
              onClick={() => onLaunchWorkbench('dashboard')}
              className="btn-accent px-8 py-4 text-base font-semibold shadow-xl shadow-[#FF5A36]/30 cursor-pointer"
            >
              <span>Launch Autonomous Workbench</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onLaunchWorkbench('jobs')}
              className="px-8 py-4 rounded-full bg-[#111116] border border-[#1D1D24] text-base font-semibold text-[#FFFFFF] hover:border-[#2D2D38] transition-all cursor-pointer"
            >
              <span>Search Live Jobs</span>
            </button>
          </div>

          <p className="text-xs font-mono text-[#8E8E9B] pt-2">
            Free &amp; open-source architecture • PostgreSQL + Gemini 2.0 • Human-In-The-Loop Safety Gate
          </p>
        </div>
      </section>

      {/* 8. MINIMAL FOOTER */}
      <footer className="py-14 bg-[#0A0A0E] text-xs text-[#8E8E9B] font-['Geist',sans-serif]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-8 pb-12 border-b border-[#1D1D24]">
            {/* Col 1 */}
            <div className="col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded bg-gradient-to-br from-[#FF5A36] to-[#FF3D14] flex items-center justify-center text-white font-bold text-xs font-mono">
                  K
                </div>
                <span className="font-display font-bold text-base text-[#FFFFFF]">Kinetic AI OS</span>
              </div>
              <p className="text-xs text-[#8E8E9B] max-w-sm leading-relaxed">
                Deterministic autonomous job search, resume fit scoring, cover letter synthesis, and recruiter email monitoring tailored for Pankaj Kumar.
              </p>
              <div className="flex items-center gap-2 text-[11px] font-mono text-[#00FF88] pt-2">
                <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
                <span>All Runtime Systems Operational</span>
              </div>
            </div>

            {/* Col 2 */}
            <div className="space-y-2.5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#FFFFFF] font-semibold block">Product</span>
              <ul className="space-y-2">
                <li><button onClick={() => onLaunchWorkbench('dashboard')} className="hover:text-[#FFFFFF] transition-colors cursor-pointer">Dashboard</button></li>
                <li><button onClick={() => onLaunchWorkbench('jobs')} className="hover:text-[#FFFFFF] transition-colors cursor-pointer">Job Search</button></li>
                <li><button onClick={() => onLaunchWorkbench('applications')} className="hover:text-[#FFFFFF] transition-colors cursor-pointer">Pipeline Kanban</button></li>
                <li><button onClick={() => onLaunchWorkbench('agent')} className="hover:text-[#FFFFFF] transition-colors cursor-pointer">Agent Console</button></li>
              </ul>
            </div>

            {/* Col 3 */}
            <div className="space-y-2.5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#FFFFFF] font-semibold block">Tools</span>
              <ul className="space-y-2">
                <li><button onClick={() => onLaunchWorkbench('cover-letters')} className="hover:text-[#FFFFFF] transition-colors cursor-pointer">Cover Letter Studio</button></li>
                <li><button onClick={() => onLaunchWorkbench('email-monitor')} className="hover:text-[#FFFFFF] transition-colors cursor-pointer">Email Classifier</button></li>
                <li><button onClick={() => onLaunchWorkbench('profile')} className="hover:text-[#FFFFFF] transition-colors cursor-pointer">Resume Profile</button></li>
                <li><button onClick={() => onLaunchWorkbench('settings')} className="hover:text-[#FFFFFF] transition-colors cursor-pointer">10 AM Scheduler</button></li>
              </ul>
            </div>

            {/* Col 4 */}
            <div className="space-y-2.5">
              <span className="font-mono text-[11px] uppercase tracking-wider text-[#FFFFFF] font-semibold block">Architecture</span>
              <ul className="space-y-2">
                <li><a href="#developers" className="hover:text-[#FFFFFF] transition-colors">TypeScript SDK</a></li>
                <li><a href="#developers" className="hover:text-[#FFFFFF] transition-colors">Gemini 2.0 Integration</a></li>
                <li><a href="#developers" className="hover:text-[#FFFFFF] transition-colors">REST Webhooks</a></li>
                <li><a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-[#FFFFFF] transition-colors">GitHub Repository</a></li>
              </ul>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] font-mono text-[#8E8E9B]">
            <p>© 2026 Kinetic Autonomous Systems. Tailored for Pankaj Kumar (Backend Engineer).</p>
            <div className="flex items-center gap-4">
              <span>Privacy</span>
              <span>Terms</span>
              <span>Security</span>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Bottom-Right Live Logs Pill (Matching Screen) */}
      <button
        onClick={() => onLaunchWorkbench('agent')}
        className="fixed bottom-6 right-6 z-30 hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#111116]/90 border border-[#1D1D24] shadow-2xl backdrop-blur-md hover:border-[#2D2D38] hover:bg-[#16161E] transition-all cursor-pointer group"
      >
        <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
        <span className="text-xs font-mono font-medium text-[#FFFFFF]">Live Logs</span>
      </button>
    </div>
  );
};
