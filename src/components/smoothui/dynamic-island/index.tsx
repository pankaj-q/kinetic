"use client";

import {
  Bell,
  Bot,
  CheckCircle2,
  CloudLightning,
  Flame,
  Globe,
  Music2,
  Pause,
  Phone,
  Play,
  Search,
  Send,
  ShieldCheck,
  SkipBack,
  SkipForward,
  Sparkles,
  Thermometer,
  Timer as TimerIcon,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { type ReactNode, useMemo, useState } from "react";

const BOUNCE_VARIANTS = {
  idle: 0.5,
  "idle-scanning": 0.35,
  "idle-match": 0.45,
  "idle-dispatch": 0.4,
  "idle-recruiter": 0.5,
  "scanning-match": 0.4,
  "match-dispatch": 0.35,
  "dispatch-recruiter": 0.45,
} as const;

const DEFAULT_BOUNCE = 0.45;
const TIMER_INTERVAL_MS = 1000;

// 1. Idle Agent Engine Status
const AgentIdle = () => {
  const [showTelemetry, setShowTelemetry] = useState(false);

  return (
    <motion.div
      className="flex items-center gap-2.5 px-3.5 py-2 cursor-pointer select-none"
      layout
      onHoverEnd={() => setShowTelemetry(false)}
      onHoverStart={() => setShowTelemetry(true)}
    >
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#FF5A36] animate-pulse" />
        <Bot className="h-4 w-4 text-white" />
        <span className="font-mono text-xs text-white font-medium">Kinetic OS</span>
      </div>

      <AnimatePresence>
        {showTelemetry ? (
          <motion.div
            animate={{ opacity: 1, width: "auto" }}
            className="flex items-center gap-1.5 overflow-hidden text-white border-l border-white/20 pl-2"
            exit={{ opacity: 0, width: 0 }}
            initial={{ opacity: 0, width: 0 }}
          >
            <Zap className="h-3 w-3 text-[#FF5A36]" />
            <span className="pointer-events-none whitespace-nowrap text-white text-[11px] font-mono">
              480ms • 10 AM Ready
            </span>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </motion.div>
  );
};

// 2. Scanning / Ingestion Stream
const AgentScanning = () => {
  const [progress, setProgress] = useState(124);

  return (
    <div className="flex w-72 items-center gap-3 overflow-hidden px-4 py-2.5 text-white">
      <div className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center text-[#FF5A36] shrink-0">
        <Search className="h-4 w-4 animate-spin" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="pointer-events-none font-medium text-xs text-white font-mono truncate">
          Scanning ATS Feeds...
        </p>
        <p className="pointer-events-none text-white/70 text-[11px] font-mono truncate">
          RemoteOK • Lever • Ashby • Greenhouse
        </p>
      </div>
      <span className="text-[10px] font-mono font-bold text-[#FF5A36] bg-[#FFE8E1]/20 px-1.5 py-0.5 rounded">
        {progress} Jobs
      </span>
    </div>
  );
};

// 3. AI Fit Match Notification
const AgentMatch = () => (
  <div className="flex w-80 items-center gap-3 overflow-hidden px-4 py-2.5 text-white">
    <div className="w-7 h-7 rounded-lg bg-[#FF5A36]/20 border border-[#FF5A36]/40 flex items-center justify-center text-[#FF5A36] shrink-0">
      <Flame className="h-4 w-4 text-[#FF5A36]" />
    </div>
    <div className="flex-1 min-w-0">
      <div className="flex items-center justify-between">
        <p className="pointer-events-none font-semibold text-xs text-white truncate">
          Staff Systems Engineer
        </p>
        <span className="text-[10px] font-mono font-bold text-[#FF5A36] bg-[#FF5A36]/20 px-1.5 py-0.5 rounded">
          94% Fit
        </span>
      </div>
      <p className="pointer-events-none text-white/70 text-[11px] truncate mt-0.5">
        Stripe • Go & Distributed Queues Citations Verified
      </p>
    </div>
  </div>
);

// 4. 10:00 AM Dispatch Progress
const AgentDispatch = () => {
  const [time, setTime] = useState(5);

  return (
    <div className="flex w-76 items-center gap-3 overflow-hidden px-4 py-2.5 text-white">
      <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0">
        <Send className="h-4 w-4" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="pointer-events-none font-semibold text-xs text-white">
            10:00 AM Dispatch Active
          </p>
          <span className="text-[10px] font-mono font-bold text-emerald-400">
            5 / 5 Sent
          </span>
        </div>
        <div className="h-1 w-full overflow-hidden rounded-full bg-white/20 mt-1.5">
          <motion.div
            animate={{ width: "100%" }}
            className="h-full bg-emerald-400"
            initial={{ width: "0%" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
};

// 5. Inbound Recruiter Call / Interview Triage
const AgentRecruiter = () => (
  <div className="flex w-80 items-center gap-3 overflow-hidden px-4 py-2.5 text-white">
    <div className="w-7 h-7 rounded-lg bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
      <Phone className="h-4 w-4 text-emerald-400 animate-bounce" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="pointer-events-none font-semibold text-xs text-white">
        Interview Invitation Incoming
      </p>
      <p className="pointer-events-none text-emerald-400 text-[11px] font-mono truncate">
        Sarah Jenkins @ Stripe (Lead AI Architect)
      </p>
    </div>
    <div className="h-2 w-2 animate-ping rounded-full bg-emerald-400 shrink-0" />
  </div>
);

// 6. Telegram Push Alert Notification
const AgentNotification = () => (
  <div className="flex w-72 items-center gap-3 overflow-hidden px-4 py-2 text-white">
    <Bell className="h-4 w-4 text-[#FF5A36]" />
    <div className="flex-1 min-w-0">
      <p className="pointer-events-none font-medium text-xs text-white font-mono">
        Telegram Push Sync
      </p>
      <p className="pointer-events-none text-white/70 text-[11px] truncate">
        5 Applications staged for user review
      </p>
    </div>
    <span className="rounded-full bg-[#FF5A36]/30 px-1.5 py-0.2 text-[10px] font-mono text-[#FF5A36]">
      NEW
    </span>
  </div>
);

export type DynamicIslandView =
  | "idle"
  | "scanning"
  | "match"
  | "dispatch"
  | "recruiter"
  | "notification";

export interface DynamicIslandProps {
  className?: string;
  idleContent?: ReactNode;
  onViewChange?: (view: DynamicIslandView) => void;
  view?: DynamicIslandView;
  showControls?: boolean;
}

export default function DynamicIsland({
  view: controlledView,
  onViewChange,
  idleContent,
  className = "",
  showControls = true,
}: DynamicIslandProps) {
  const [internalView, setInternalView] = useState<DynamicIslandView>("idle");
  const [variantKey, setVariantKey] = useState<string>("idle");
  const shouldReduceMotion = useReducedMotion();

  const view = controlledView ?? internalView;

  const content = useMemo(() => {
    switch (view) {
      case "scanning":
        return <AgentScanning />;
      case "match":
        return <AgentMatch />;
      case "dispatch":
        return <AgentDispatch />;
      case "recruiter":
        return <AgentRecruiter />;
      case "notification":
        return <AgentNotification />;
      default:
        return idleContent ?? <AgentIdle />;
    }
  }, [view, idleContent]);

  const handleViewChange = (newView: DynamicIslandView) => {
    if (view === newView) {
      return;
    }
    setVariantKey(`${view}-${newView}`);
    if (onViewChange) {
      onViewChange(newView);
    } else {
      setInternalView(newView);
    }
  };

  return (
    <div className={`relative ${className}`}>
      <div className="relative flex flex-col items-center justify-center">
        {/* Kinetic Island Pill Surface */}
        <motion.div
          className="mx-auto w-fit min-w-[120px] overflow-hidden rounded-full bg-[#121210] border border-[#2B2A27] shadow-xl"
          layout
          style={{ borderRadius: 32 }}
          transition={
            shouldReduceMotion
              ? { duration: 0 }
              : {
                  bounce:
                    BOUNCE_VARIANTS[
                      variantKey as keyof typeof BOUNCE_VARIANTS
                    ] ?? DEFAULT_BOUNCE,
                  duration: 0.28,
                  type: "spring" as const,
                }
          }
        >
          <motion.div
            animate={
              shouldReduceMotion
                ? { opacity: 1, scale: 1 }
                : {
                    filter: "blur(0px)",
                    opacity: 1,
                    originX: 0.5,
                    originY: 0.5,
                    scale: 1,
                    transition: { delay: 0.04 },
                  }
            }
            initial={{
              filter: "blur(4px)",
              opacity: 0,
              originX: 0.5,
              originY: 0.5,
              scale: 0.92,
            }}
            key={view}
            transition={{
              bounce:
                BOUNCE_VARIANTS[variantKey as keyof typeof BOUNCE_VARIANTS] ??
                DEFAULT_BOUNCE,
              type: "spring" as const,
            }}
          >
            {content}
          </motion.div>
        </motion.div>

        {/* State Interactive Switcher Pills */}
        {showControls && (
          <div className="mt-4 flex items-center justify-center gap-1.5 rounded-full border border-[#DDDAD2] bg-[#FCFBF8] p-1 shadow-xs">
            {[
              { icon: <Bot className="w-3.5 h-3.5" />, key: "idle", label: "Idle" },
              { icon: <Search className="w-3.5 h-3.5" />, key: "scanning", label: "Scan" },
              { icon: <Flame className="w-3.5 h-3.5" />, key: "match", label: "Match" },
              { icon: <Send className="w-3.5 h-3.5" />, key: "dispatch", label: "Dispatch" },
              { icon: <Phone className="w-3.5 h-3.5" />, key: "recruiter", label: "Recruiter" },
            ].map(({ key, icon, label }) => (
              <button
                key={key}
                aria-label={label}
                onClick={() => {
                  if (view !== key) {
                    setVariantKey(`${view}-${key}`);
                    handleViewChange(key as DynamicIslandView);
                  }
                }}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono transition-all cursor-pointer ${
                  view === key
                    ? "bg-[#111111] text-white font-semibold shadow-xs"
                    : "text-[#6B6B67] hover:text-[#111111] hover:bg-[#F7F6F2]"
                }`}
                type="button"
              >
                {icon}
                <span className="hidden sm:inline">{label}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

