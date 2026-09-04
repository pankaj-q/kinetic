import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Briefcase,
  LayoutDashboard,
  Sparkles,
  Layers,
  FileText,
  Mail,
  Send,
  Sliders,
  Bell,
  CheckCircle2,
  Bot,
  Flame,
  Clock,
  ExternalLink,
  ChevronRight,
  Zap,
  Globe,
  Home,
  ArrowRight
} from 'lucide-react';
import { NotificationMessage, TelegramConfig } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notifications: NotificationMessage[];
  unreadCount: number;
  telegramConfig: TelegramConfig;
  onMarkNotificationRead: (id: string) => void;
  onClearNotifications: () => void;
  onOpenApplication?: (appId: string) => void;
  isAgentRunning?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  notifications,
  unreadCount,
  telegramConfig,
  onMarkNotificationRead,
  onClearNotifications,
  onOpenApplication,
  isAgentRunning,
}) => {
  const [showNotifPopover, setShowNotifPopover] = useState(false);

  const workbenchNavItems = [
    { id: 'landing', label: 'Overview', icon: Globe },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'jobs', label: 'Job Stream', icon: Briefcase },
    { id: 'applications', label: 'Pipeline', icon: Layers },
    { id: 'agent', label: 'Agent Console', icon: Bot, badge: isAgentRunning ? 'Active' : undefined },
    { id: 'profile', label: 'Resume', icon: FileText },
    { id: 'cover-letters', label: 'Cover Letters', icon: Sparkles },
    { id: 'email-monitor', label: 'Email Monitor', icon: Mail },
    { id: 'settings', label: 'Settings', icon: Sliders },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#DDDAD2] bg-[#F7F6F2]/95 backdrop-blur-md transition-all font-['Geist',sans-serif]">
      {/* 1. TOP RUNNING ANNOUNCEMENT & TELEMETRY BAR */}
      <div className="w-full border-b border-[#DDDAD2] bg-[#FAF9F5] py-1.5 overflow-hidden relative group/marquee [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="animate-marquee-slow flex items-center justify-center gap-6 text-xs select-none font-mono">
          <div className="flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#FCFBF8] border border-[#DDDAD2] text-[#6B6B67] text-[11px] whitespace-nowrap shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#FF5A36] animate-pulse" />
            <span>10:00 AM ROUTINE: <strong className="text-[#111111] font-bold">READY (5+ APPLIED DAILY)</strong></span>
          </div>

          <div className="flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#FCFBF8] border border-[#DDDAD2] text-[#6B6B67] text-[11px] whitespace-nowrap shrink-0">
            <Send className="w-3 h-3 text-[#FF5A36]" />
            <span>TELEGRAM & GMAIL: <strong className="text-[#111111] font-bold">LIVE SYNCED</strong></span>
          </div>

          <div className="flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#FCFBF8] border border-[#DDDAD2] text-[#6B6B67] text-[11px] whitespace-nowrap shrink-0">
            <Bot className="w-3 h-3 text-[#FF5A36]" />
            <span>AI AGENT: <strong className="text-[#111111] font-bold">GEMINI 2.0 FLASH</strong></span>
          </div>

          <div className="flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#FCFBF8] border border-[#DDDAD2] text-[#6B6B67] text-[11px] whitespace-nowrap shrink-0">
            <Flame className="w-3 h-3 text-[#FF5A36]" />
            <span>MATCH ACCURACY: <strong className="text-[#111111] font-bold">94%+ FIT</strong></span>
          </div>

          {/* Duplicated for smooth infinite loop */}
          <div className="flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#FCFBF8] border border-[#DDDAD2] text-[#6B6B67] text-[11px] whitespace-nowrap shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#FF5A36] animate-pulse" />
            <span>10:00 AM ROUTINE: <strong className="text-[#111111] font-bold">READY (5+ APPLIED DAILY)</strong></span>
          </div>

          <div className="flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#FCFBF8] border border-[#DDDAD2] text-[#6B6B67] text-[11px] whitespace-nowrap shrink-0">
            <Send className="w-3 h-3 text-[#FF5A36]" />
            <span>TELEGRAM & GMAIL: <strong className="text-[#111111] font-bold">LIVE SYNCED</strong></span>
          </div>
        </div>
      </div>

      {/* 2. MAIN NAVBAR CONTAINER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Left: Single Fixed Brand Logo */}
          <div className="flex items-center gap-3 shrink-0">
            <motion.div
              id="kinetic-brand"
              onClick={() => setActiveTab('landing')}
              className="flex items-center gap-2.5 cursor-pointer select-none group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-8 h-8 rounded-lg bg-[#111111] flex items-center justify-center text-white shadow-xs">
                <Bot className="w-4 h-4 text-[#FF5A36]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-editorial text-2xl font-normal tracking-tight text-[#111111]">
                  Kinetic
                </span>
                <span className="text-[10px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#FFE8E1] text-[#FF5A36] uppercase whitespace-nowrap">
                  AI OS
                </span>
              </div>
            </motion.div>
          </div>

          {/* Center: Middle Navigation Tabs */}
          {activeTab === 'landing' ? (
            <nav className="hidden lg:flex items-center gap-6 text-[14px] font-medium text-[#6B6B67]">
              <a href="#product" className="hover:text-[#111111] transition-colors">Product</a>
              <a href="#features" className="hover:text-[#111111] transition-colors">Features</a>
              <a href="#how-it-works" className="hover:text-[#111111] transition-colors">How It Works</a>
              <a href="#developers" className="hover:text-[#111111] transition-colors">Developers</a>
              <button
                onClick={() => setActiveTab('dashboard')}
                className="hover:text-[#111111] transition-colors cursor-pointer"
              >
                Dashboard
              </button>
              <button
                onClick={() => setActiveTab('jobs')}
                className="hover:text-[#111111] transition-colors cursor-pointer"
              >
                Job Stream
              </button>
              <button
                onClick={() => setActiveTab('agent')}
                className="hover:text-[#111111] transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <span>Agent Console</span>
                {isAgentRunning && <span className="w-1.5 h-1.5 rounded-full bg-[#FF5A36] animate-pulse" />}
              </button>
            </nav>
          ) : (
            <nav className="hidden lg:flex items-center gap-1 bg-[#FAF9F5] p-1 rounded-xl border border-[#DDDAD2]">
              {workbenchNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-tab-${item.id}`}
                    onClick={() => setActiveTab(item.id)}
                    className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap z-10 cursor-pointer ${
                      isActive
                        ? 'text-[#111111] font-bold'
                        : 'text-[#6B6B67] hover:text-[#111111]'
                    }`}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="activeNavPill"
                        className="absolute inset-0 bg-[#FCFBF8] border border-[#DDDAD2] rounded-lg -z-10 shadow-xs"
                        transition={{ type: 'spring', stiffness: 450, damping: 35 }}
                      />
                    )}
                    <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FF5A36]' : 'text-[#6B6B67]'}`} />
                    <span>{item.label}</span>
                    {item.badge && (
                      <span className="px-1.5 py-0.2 rounded-full text-[9px] font-mono font-bold bg-[#FFE8E1] text-[#FF5A36] animate-pulse">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right: Quick Action & Notifications */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-[#DDDAD2] bg-[#FCFBF8] text-xs font-mono text-[#6B6B67] hover:text-[#111111] hover:border-[#111111] transition-all"
            >
              <span>GitHub</span>
              <span className="text-[#111111] font-semibold">★ 4.8k</span>
            </a>

            {/* Launch Workbench or Agent CTA */}
            {activeTab === 'landing' ? (
              <button
                onClick={() => setActiveTab('dashboard')}
                className="btn-accent text-xs font-semibold"
              >
                <span>Launch Workbench</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('agent')}
                className="btn-accent hidden md:inline-flex text-xs font-semibold"
              >
                <Zap className="w-3.5 h-3.5 text-white" />
                <span>Run Agent Loop</span>
              </button>
            )}

            {/* Notifications Bell */}
            <div className="relative">
              <button
                id="notifications-bell-button"
                onClick={() => setShowNotifPopover(!showNotifPopover)}
                className="btn-icon relative"
                aria-label="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF5A36] text-[9px] font-bold text-white flex items-center justify-center shadow-xs animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Notification Popover Dropdown */}
              <AnimatePresence>
                {showNotifPopover && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: -10 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 rounded-xl bg-[#FCFBF8] py-2 z-50 border border-[#DDDAD2] shadow-sm"
                  >
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-[#DDDAD2]">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold font-mono tracking-tight text-[#111111] uppercase">Live Telemetry Stream</span>
                        {unreadCount > 0 && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-[#FFE8E1] text-[#FF5A36]">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        {unreadCount > 0 && (
                          <button
                            onClick={onClearNotifications}
                            className="text-[10px] text-[#6B6B67] hover:text-[#111111] transition-colors"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="max-h-80 overflow-y-auto divide-y divide-[#DDDAD2]">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-[#6B6B67]">
                          No notifications yet. Telemetry events will appear here.
                        </div>
                      ) : (
                        notifications.map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              if (!n.read) onMarkNotificationRead(n.id);
                              // @ts-ignore
                              if (n.relatedApplicationId && onOpenApplication) {
                                // @ts-ignore
                                onOpenApplication(n.relatedApplicationId);
                                setShowNotifPopover(false);
                              }
                            }}
                            className={`p-3.5 text-xs cursor-pointer hover:bg-[#F7F6F2] transition-colors flex items-start gap-2.5 ${
                              !n.read ? 'bg-[#FFE8E1]/30' : ''
                            }`}
                          >
                            <div className="mt-0.5">
                              {n.type === 'high_match' ? (
                                <Flame className="w-4 h-4 text-[#FF5A36]" />
                              ) : n.type === 'submission_success' ? (
                                <CheckCircle2 className="w-4 h-4 text-[#111111]" />
                              ) : (
                                <Bot className="w-4 h-4 text-[#FF5A36]" />
                              )}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-semibold text-[#111111]">{n.title}</span>
                                <span className="text-[10px] text-[#6B6B67] font-mono">
                                  {new Date(n.timestamp).toLocaleTimeString([], {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </span>
                              </div>
                              <p className="text-xs text-[#6B6B67] mt-1 line-clamp-2 leading-relaxed">
                                {n.body}
                              </p>
                              {n.data?.applicationId && (
                                <div className="mt-1.5 flex items-center gap-1 text-[11px] text-[#FF5A36] font-semibold hover:underline">
                                  <span>Review Application</span>
                                  <ChevronRight className="w-3 h-3" />
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Row */}
        <div className="lg:hidden flex items-center gap-1 overflow-x-auto py-2.5 border-t border-[#DDDAD2] -mx-4 px-4 scrollbar-none">
          {workbenchNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-[#111111] text-white'
                    : 'text-[#6B6B67] hover:text-[#111111] bg-[#FCFBF8] border border-[#DDDAD2]'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

