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
  Zap,
  Cpu,
  Activity
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
            <div className="w-9 h-9 rounded-xl bg-[#111116] border border-[#1D1D24] flex items-center justify-center text-[#FF5A36] shadow-sm">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
                ReAct Telemetry Engine
              </h1>
              <p className="text-xs text-[#8E8E9B] mt-0.5">
                Autonomous multi-step ReAct reasoning loop. Tool calling with strict human-in-the-loop safety boundaries.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`px-3 py-1.5 rounded-full text-xs font-mono font-medium flex items-center gap-2 ${
              isAgentRunning
                ? 'bg-[#FF5A36]/10 text-[#FF5A36] border border-[#FF5A36]/40 animate-pulse'
                : 'bg-[#111116] text-[#00FF88] border border-[#1D1D24]'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isAgentRunning ? 'bg-[#FF5A36]' : 'bg-[#00FF88] animate-ping'}`} />
            <span>{isAgentRunning ? 'AGENT REASONING LOOP ACTIVE' : 'TELEMETRY STANDBY'}</span>
          </span>
        </div>
      </div>

      {/* Agent Goal Input & Controls Box */}
      <div className="p-6 rounded-2xl bg-[#111116] border border-[#1D1D24] space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-mono font-semibold text-[#8E8E9B] flex items-center justify-between uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-white">
              <Sparkles className="w-3.5 h-3.5 text-[#FF5A36]" />
              Autonomous Agent Goal Prompt
            </span>
            <span className="text-[11px] text-[#8E8E9B] normal-case">Natural language instruction</span>
          </label>
          <textarea
            id="agent-goal-textarea"
            rows={2}
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            placeholder="Describe the agent objective..."
            className="w-full text-xs sm:text-sm text-white bg-[#070709] border border-[#1D1D24] rounded-xl p-4 focus:outline-none focus:border-[#FF5A36] font-mono leading-relaxed placeholder:text-[#4A4A57]"
          />
        </div>

        {/* Presets */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] text-[#8E8E9B] font-semibold uppercase tracking-wider whitespace-nowrap font-mono">Presets:</span>
          {presets.map((p, i) => (
            <button
              key={i}
              onClick={() => {
                setGoal(p.prompt);
                setMinMatchScore(p.score);
              }}
              className="px-3 py-1 rounded-lg bg-[#14141B] hover:bg-[#1C1C26] hover:border-[#FF5A36]/40 text-[#CCCCCC] text-[11px] font-mono whitespace-nowrap transition-all border border-[#1D1D24]"
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-[#1D1D24]">
          <div className="flex items-center gap-3">
            <label className="text-xs text-[#8E8E9B] font-mono">Min Match Score:</label>
            <div className="flex items-center gap-2">
              <input
                type="range"
                min={60}
                max={95}
                step={5}
                value={minMatchScore}
                onChange={(e) => setMinMatchScore(Number(e.target.value))}
                className="w-32 accent-[#FF5A36] bg-[#1D1D24]"
              />
              <span className="text-xs font-bold text-[#FF5A36] w-10 font-mono">{minMatchScore}%</span>
            </div>
          </div>

          <button
            id="execute-agent-loop-btn"
            onClick={handleLaunch}
            disabled={isAgentRunning || !goal.trim()}
            className="btn-accent text-xs py-2.5 px-6 font-semibold disabled:opacity-50"
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
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 p-5 rounded-2xl bg-[#111116] border border-[#1D1D24]">
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8E8E9B]">Jobs Scanned</span>
            <div className="text-2xl font-bold font-display text-white tracking-tight">{currentSession.metrics.jobsScanned}</div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8E8E9B]">AI Matches</span>
            <div className="text-2xl font-bold font-display text-[#FF5A36] tracking-tight">{currentSession.metrics.jobsMatched}</div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8E8E9B]">Letters Synthesized</span>
            <div className="text-2xl font-bold font-display text-white tracking-tight">{currentSession.metrics.coverLettersGenerated}</div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8E8E9B]">Applications Ready</span>
            <div className="text-2xl font-bold font-display text-[#00FF88] tracking-tight">{currentSession.metrics.applicationsPrepared}</div>
          </div>
          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8E8E9B]">Dispatched Alerts</span>
            <div className="text-2xl font-bold font-display text-white tracking-tight">{currentSession.metrics.notificationsSent}</div>
          </div>
        </div>
      )}

      {/* Live ReAct Execution Trace / Console Logs */}
      <div className="p-6 rounded-2xl bg-[#111116] border border-[#1D1D24] space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#FF5A36]" />
            <h2 className="text-base font-bold font-display text-white tracking-tight">ReAct Execution Trace & Reasoning Log</h2>
          </div>

          {currentSession?.status === 'completed' && currentSession.metrics.applicationsPrepared > 0 && (
            <button
              onClick={() => onNavigateTab('applications')}
              className="btn-accent text-xs py-1.5 px-3.5 font-semibold"
            >
              <span>Review Prepared Applications</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {!currentSession || currentSession.logs.length === 0 ? (
          <div className="p-12 text-center text-[#8E8E9B] text-xs border border-dashed border-[#1D1D24] rounded-xl space-y-2 bg-[#0A0A0D]">
            <Bot className="w-8 h-8 text-[#5A5A66] mx-auto" />
            <p className="font-mono">Click "Execute Autonomous Loop" above to watch step-by-step reasoning telemetry live.</p>
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
                      ? 'bg-[#FF5A36]/10 border-[#FF5A36]/50'
                      : log.status === 'failed'
                      ? 'bg-rose-950/30 border-rose-800/60'
                      : 'bg-[#0D0D12] border-[#1D1D24]'
                  }`}
                >
                  {/* Step Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#FF5A36]/20 text-[#FF5A36] border border-[#FF5A36]/30">
                        STEP {log.step}
                      </span>
                      <span className="text-xs font-bold text-white font-mono">{log.action}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono bg-[#14141B] text-[#8E8E9B] border border-[#1D1D24]">
                        tool: {log.tool}
                      </span>
                      <span className="text-[10px] text-[#5A5A66] font-mono">
                        {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                      </span>
                    </div>
                  </div>

                  {/* Thought / Reasoning Bubble */}
                  <div className="mt-3 p-3.5 rounded-xl bg-[#070709] border border-[#1D1D24] text-xs text-[#CCCCCC] leading-relaxed font-sans">
                    <div className="flex items-center gap-1.5 text-[#FF5A36] font-bold text-[10px] mb-1 uppercase tracking-wider font-mono">
                      <Sparkles className="w-3 h-3" />
                      <span>Observation & Reasoning</span>
                    </div>
                    {log.thought}
                  </div>

                  {/* Expandable Tool Input & Output payload */}
                  <div className="mt-3 flex items-center justify-between">
                    <button
                      onClick={() => toggleLogExpand(log.id)}
                      className="text-[11px] text-[#8E8E9B] hover:text-white flex items-center gap-1 font-mono transition-colors"
                    >
                      <Code2 className="w-3 h-3 text-[#FF5A36]" />
                      <span>{isExpanded ? 'Hide Payload' : 'View Tool I/O Data'}</span>
                      {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
                    </button>

                    {log.status === 'waiting_approval' && (
                      <span className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold bg-[#FF5A36]/20 text-[#FF5A36] border border-[#FF5A36]/40 flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        Human-In-The-Loop Guard
                      </span>
                    )}
                  </div>

                  {isExpanded && (
                    <div className="mt-2.5 grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] font-mono pt-2.5 border-t border-[#1D1D24]">
                      <div className="bg-[#070709] border border-[#1D1D24] p-3 rounded-xl overflow-x-auto">
                        <span className="text-[#8E8E9B] font-bold block mb-1 font-mono">Input Arguments:</span>
                        <pre className="text-[#E2E2E8] font-mono text-[11px]">{JSON.stringify(log.input, null, 2)}</pre>
                      </div>
                      <div className="bg-[#070709] border border-[#1D1D24] p-3 rounded-xl overflow-x-auto">
                        <span className="text-[#8E8E9B] font-bold block mb-1 font-mono">Execution Output:</span>
                        <pre className="text-[#00FF88] font-mono text-[11px]">{JSON.stringify(log.output, null, 2)}</pre>
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
