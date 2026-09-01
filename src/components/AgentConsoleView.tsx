import React, { useState } from 'react';
import {
  Bot,
  Play,
  RotateCw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Clock,
  Code2,
  Terminal,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Send,
  Layers,
  FileText,
  Flame,
  ArrowRight,
  Zap
} from 'lucide-react';
import { AgentRunSession, AgentActionLog } from '../types';

interface AgentConsoleViewProps {
  sessions: AgentRunSession[];
  activeSession: AgentRunSession | null;
  onRunAgent: (goal: string, minMatchScore: number) => Promise<void>;
  onRunMorningRoutine?: () => Promise<any>;
  isAgentRunning: boolean;
  onNavigateTab: (tab: string) => void;
  onOpenApplication?: (appId: string) => void;
}

export const AgentConsoleView: React.FC<AgentConsoleViewProps> = ({
  sessions,
  activeSession,
  onRunAgent,
  onRunMorningRoutine,
  isAgentRunning,
  onNavigateTab,
  onOpenApplication,
}) => {
  const [goal, setGoal] = useState(
    '10:00 AM Morning Job Search & Auto-Apply Routine: Scan live boards, evaluate tech match scores, apply to at least 5 target positions, and dispatch comprehensive Telegram & Email reports.'
  );
  const [minMatchScore, setMinMatchScore] = useState<number>(80);
  const [expandedLogIds, setExpandedLogIds] = useState<Record<string, boolean>>({});

  const toggleLogExpand = (logId: string) => {
    setExpandedLogIds((prev) => ({ ...prev, [logId]: !prev[logId] }));
  };

  const handleLaunch = () => {
    if (!isAgentRunning) {
      onRunAgent(goal, minMatchScore);
    }
  };

  const currentSession = activeSession || (sessions.length > 0 ? sessions[0] : null);

  const presets = [
    {
      label: '🌅 10:00 AM Morning Routine (5+ Applied + Telegram + Email)',
      prompt: '10:00 AM Morning Job Search & Auto-Apply Routine: Scan live boards, evaluate tech match scores, apply to at least 5 target positions, and dispatch comprehensive Telegram & Email reports.',
      score: 80,
    },
    {
      label: '🚀 Full Pipeline (Backend & Distributed Systems)',
      prompt: 'Search remote senior backend & distributed systems jobs, calculate deep match scores, generate tailored cover letters, and prepare applications awaiting human approval.',
      score: 85,
    },
    {
      label: '🤖 AI & Full Stack Roles',
      prompt: 'Discover full stack React, Node.js and AI agent tooling positions, evaluate technical match with candidate profile, draft customized cover letters, and notify via Telegram.',
      score: 80,
    },
    {
      label: '⚡ Rapid Scan & Ingest Only',
      prompt: 'Execute multi-source job ingestion across RemoteOK, Greenhouse, and Lever, deduplicate listings, and compute match scores for all new jobs.',
      score: 75,
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300 font-['Geist',sans-serif]">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
              <Bot className="w-4 h-4 text-[#2563EB]" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-normal font-editorial text-[#0F172A] tracking-tight">
              AI Agent Telemetry Console
            </h1>
          </div>
          <p className="text-xs text-[#64748B] mt-1">
            Autonomous multi-step ReAct reasoning loop. Executes tool calling with strict human-in-the-loop safety boundaries.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1.5 font-['Geist_Mono',monospace] ${
              isAgentRunning
                ? 'bg-amber-50 text-amber-700 border border-amber-300 animate-pulse'
                : 'bg-emerald-50 text-[#10B981] border border-emerald-200'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isAgentRunning ? 'bg-amber-500' : 'bg-[#10B981]'}`} />
            <span>{isAgentRunning ? 'Agent Loop Running' : 'Telemetry Ready'}</span>
          </span>
        </div>
      </div>

      {/* Agent Goal Input & Controls Box */}
      <div className="p-6 rounded-2xl bg-white space-y-4 border border-[#E2E8F0] shadow-xs">
        <div className="space-y-2">
          <label className="text-xs font-bold text-[#0F172A] flex items-center justify-between uppercase tracking-wider font-['Geist',sans-serif]">
            <span className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
              Autonomous Agent Goal Prompt
            </span>
            <span className="text-[11px] text-[#64748B] font-['Geist_Mono',monospace] normal-case">Natural language instruction</span>
          </label>
          <textarea
            id="agent-goal-textarea"
            rows={2}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Describe the agent objective..."
            className="w-full text-xs sm:text-sm text-[#0F172A] bg-[#F8FAFC] border border-[#E2E8F0] rounded-xl p-4 focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-blue-500/10 font-sans leading-relaxed"
          />
        </div>

        {/* Presets */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] text-[#64748B] font-semibold uppercase tracking-wider whitespace-nowrap font-['Geist_Mono',monospace]">Presets:</span>
          {presets.map((p, i) => (
            <button
              key={i}
              onClick={() => {
                setGoal(p.prompt);
                setMinMatchScore(p.score);
              }}
              className="px-3 py-1 rounded-lg bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#334155] text-[11px] font-medium whitespace-nowrap transition-all border border-[#E2E8F0]"
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-3 border-t border-[#E2E8F0]">
          <div className="flex items-center gap-3">
            <label className="text-xs text-[#64748B] font-medium font-['Geist',sans-serif]">Min Match Score:</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={60}
                max={95}
                step={5}
                value={minMatchScore}
                onChange={(e) => setMinMatchScore(Number(e.target.value))}
                className="w-32 accent-[#2563EB]"
              />
              <span className="text-xs font-bold text-[#2563EB] w-10 font-['Geist_Mono',monospace]">{minMatchScore}%</span>
            </div>
          </div>

          <button
            id="execute-agent-loop-btn"
            onClick={handleLaunch}
            disabled={isAgentRunning || !goal.trim()}
            className="huvo-glow-button flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all active:scale-95 disabled:opacity-50 font-['Geist',sans-serif]"
          >
            {isAgentRunning ? (
              <RotateCw className="w-4 h-4 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 text-white" />
            )}
            <span>{isAgentRunning ? 'Reasoning & Executing Tools...' : 'Execute Autonomous Loop'}</span>
          </button>
        </div>
      </div>

      {/* Metrics Banner */}
      {currentSession && (
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 p-5 rounded-2xl bg-white border border-[#E2E8F0] shadow-xs">
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] font-['Geist_Mono',monospace]">Jobs Scanned</span>
            <div className="text-xl font-extrabold text-[#0F172A] tracking-tight">{currentSession.metrics.jobsScanned}</div>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] font-['Geist_Mono',monospace]">AI Matches</span>
            <div className="text-xl font-extrabold text-[#2563EB] tracking-tight">{currentSession.metrics.jobsMatched}</div>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] font-['Geist_Mono',monospace]">Letters Synthesized</span>
            <div className="text-xl font-extrabold text-purple-600 tracking-tight">{currentSession.metrics.coverLettersGenerated}</div>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] font-['Geist_Mono',monospace]">Applications Prepared</span>
            <div className="text-xl font-extrabold text-amber-600 tracking-tight">{currentSession.metrics.applicationsPrepared}</div>
          </div>
          <div className="space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B] font-['Geist_Mono',monospace]">Dispatched Alerts</span>
            <div className="text-xl font-extrabold text-[#10B981] tracking-tight">{currentSession.metrics.notificationsSent}</div>
          </div>
        </div>
      )}

      {/* Live ReAct Execution Trace / Console Logs */}
      <div className="p-6 rounded-2xl bg-white space-y-4 border border-[#E2E8F0] shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#2563EB]" />
            <h2 className="text-base font-normal font-editorial text-[#0F172A] tracking-tight">ReAct Execution Trace & Reasoning Log</h2>
          </div>

          {currentSession?.status === 'completed' && currentSession.metrics.applicationsPrepared > 0 && (
            <button
              onClick={() => onNavigateTab('applications')}
              className="huvo-glow-button flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-white font-bold text-xs transition-all font-['Geist',sans-serif]"
            >
              <span>Review Prepared Applications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {!currentSession || currentSession.logs.length === 0 ? (
          <div className="p-12 text-center text-[#64748B] text-xs border border-dashed border-[#CBD5E1] rounded-xl space-y-2 bg-[#F8FAFC]">
            <Bot className="w-8 h-8 text-[#94A3B8] mx-auto" />
            <p>Click "Execute Autonomous Loop" above to watch the step-by-step reasoning telemetry live.</p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {currentSession.logs.map((log) => {
              const isExpanded = expandedLogIds[log.id];
              return (
                <div
                  key={log.id}
                  className={`p-4 sm:p-5 rounded-xl border transition-all ${
                    log.status === 'waiting_approval'
                      ? 'bg-amber-50/60 border-amber-300'
                      : log.status === 'failed'
                      ? 'bg-rose-50/60 border-rose-300'
                      : 'bg-[#F8FAFC] border-[#E2E8F0]'
                  }`}
                >
                  {/* Step Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-['Geist_Mono',monospace] font-bold bg-blue-50 text-[#2563EB] border border-blue-200">
                        STEP {log.step}
                      </span>
                      <span className="text-xs font-bold text-[#0F172A] font-['Geist',sans-serif]">{log.action}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-['Geist_Mono',monospace] bg-[#F1F5F9] text-[#475569] border border-[#E2E8F0]">
                        tool: {log.tool}
                      </span>
                      <span className="text-[10px] text-[#94A3B8] font-['Geist_Mono',monospace]">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Thought / Reasoning Bubble */}
                  <div className="mt-3 p-3.5 rounded-lg bg-white border border-[#E2E8F0] text-xs text-[#334155] leading-relaxed font-sans shadow-2xs">
                    <div className="flex items-center gap-1.5 text-[#2563EB] font-bold text-[11px] mb-1 uppercase tracking-wider font-['Geist_Mono',monospace]">
                      <Sparkles className="w-3 h-3" />
                      <span>Observation & Reasoning</span>
                    </div>
                    {log.thought}
                  </div>

                  {/* Expandable Tool Input & Output payload */}
                  <div className="mt-3 flex items-center justify-between">
                    <button
                      onClick={() => toggleLogExpand(log.id)}
                      className="text-[11px] text-[#64748B] hover:text-[#0F172A] flex items-center gap-1 font-['Geist_Mono',monospace] transition-colors"
                    >
                      <Code2 className="w-3 h-3" />
                      <span>{isExpanded ? 'Hide Payload' : 'View Tool I/O Data'}</span>
                      {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </button>

                    {log.status === 'waiting_approval' && (
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1 font-['Geist_Mono',monospace]">
                        <ShieldCheck className="w-3 h-3" />
                        Human-In-The-Loop Guard
                      </span>
                    )}
                  </div>

                  {isExpanded && (
                    <div className="mt-2.5 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-['Geist_Mono',monospace] pt-2.5 border-t border-[#E2E8F0]">
                      <div className="bg-white p-3 rounded-lg overflow-x-auto border border-[#E2E8F0] shadow-2xs">
                        <span className="text-[#64748B] font-bold block mb-1">Input Arguments:</span>
                        <pre className="text-[#334155]">{JSON.stringify(log.input, null, 2)}</pre>
                      </div>
                      <div className="bg-white p-3 rounded-lg overflow-x-auto border border-[#E2E8F0] shadow-2xs">
                        <span className="text-[#64748B] font-bold block mb-1">Execution Output:</span>
                        <pre className="text-[#334155]">{JSON.stringify(log.output, null, 2)}</pre>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

