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
  ArrowRight,
  Sun,
  Moon
} from 'lucide-react';
import { NotificationMessage, TelegramConfig, User } from '../types';

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
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
  onOpenTelegramModal?: () => void;
  currentUser?: User | null;
  onOpenAuthModal?: () => void;
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
  theme = 'dark',
  onToggleTheme,
  onOpenTelegramModal,
  currentUser,
  onOpenAuthModal,
}) => {
  const [showNotifPopover, setShowNotifPopover] = useState(false);

  const workbenchNavItems = [
    { id: 'landing', label: 'Overview', icon: Globe },
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'jobs', label: 'Jobs Feed', icon: Briefcase },
    { id: 'applications', label: 'Applications', icon: Layers },
    { id: 'agent', label: 'Agent Console', icon: Bot, badge: isAgentRunning ? 'Active' : undefined },
    { id: 'profile', label: 'Profile', icon: FileText },
    { id: 'cover-letters', label: 'Cover Letters', icon: Sparkles },
    { id: 'email-monitor', label: 'Email Monitor', icon: Mail },
    { id: 'settings', label: 'Settings', icon: Sliders },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#1D1D24] bg-[#070709]/95 backdrop-blur-md transition-colors font-['Geist',sans-serif]">
      {/* Top Running Status Marquee */}
      <div className="w-full border-b border-[#1D1D24] bg-[#0A0A0E] py-1.5 overflow-hidden relative group/marquee [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="animate-marquee-slow flex items-center justify-center gap-6 text-xs select-none font-mono">
          <div className="flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#111116] border border-[#1D1D24] text-[#8E8E9B] text-[11px] whitespace-nowrap shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
            <span>10:00 AM ROUTINE: <strong className="text-[#00FF88] font-bold">READY (5+ APPLIED DAILY)</strong></span>
          </div>

          <div
            onClick={onOpenTelegramModal}
            className="flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#111116] border border-[#1D1D24] hover:border-[#FF5A36]/60 cursor-pointer text-[#8E8E9B] text-[11px] whitespace-nowrap shrink-0 transition-colors"
          >
            <Send className="w-3 h-3 text-[#FF5A36]" />
            <span>TELEGRAM ALERT: <strong className="text-white font-bold">{telegramConfig.chatId ? `CHAT ${telegramConfig.chatId}` : 'CONNECT NOW'}</strong></span>
          </div>

          <div className="flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#111116] border border-[#1D1D24] text-[#8E8E9B] text-[11px] whitespace-nowrap shrink-0">
            <Bot className="w-3 h-3 text-[#FF5A36]" />
            <span>ENGINE: <strong className="text-white font-bold">GEMINI 2.0 REACT AGENT</strong></span>
          </div>

          <div className="flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#111116] border border-[#1D1D24] text-[#8E8E9B] text-[11px] whitespace-nowrap shrink-0">
            <Flame className="w-3 h-3 text-[#FF5A36]" />
            <span>TARGET FIT: <strong className="text-[#00FF88] font-bold">&ge;80% BENCHMARK</strong></span>
          </div>

          {/* Loop duplicate */}
          <div className="flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#111116] border border-[#1D1D24] text-[#8E8E9B] text-[11px] whitespace-nowrap shrink-0">
            <span className="w-2 h-2 rounded-full bg-[#00FF88] animate-pulse" />
            <span>10:00 AM ROUTINE: <strong className="text-[#00FF88] font-bold">READY (5+ APPLIED DAILY)</strong></span>
          </div>

          <div
            onClick={onOpenTelegramModal}
            className="flex items-center gap-2 px-3 py-0.5 rounded-full bg-[#111116] border border-[#1D1D24] hover:border-[#FF5A36]/60 cursor-pointer text-[#8E8E9B] text-[11px] whitespace-nowrap shrink-0 transition-colors"
          >
            <Send className="w-3 h-3 text-[#FF5A36]" />
            <span>TELEGRAM ALERT: <strong className="text-white font-bold">{telegramConfig.chatId ? `CHAT ${telegramConfig.chatId}` : 'CONNECT NOW'}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Navbar Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          {/* Brand Wordmark with Aalto Display font */}
          <div className="flex items-center gap-3 shrink-0">
            <motion.div
              id="kinetic-brand"
              onClick={() => setActiveTab('dashboard')}
              className="flex items-center gap-2.5 cursor-pointer select-none group"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#FF5A36] to-[#FF3D14] flex items-center justify-center text-white shadow-md shadow-[#FF5A36]/20 font-bold text-base font-mono">
                K
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-display text-xl font-bold tracking-wider text-white uppercase">
                  Kinetic
                </span>
                <span className="text-[10px] font-mono font-medium tracking-wider px-2 py-0.5 rounded-full bg-[#16161E] border border-[#1D1D24] text-[#8E8E9B] uppercase whitespace-nowrap hidden sm:inline-block">
                  {currentUser?.name ? currentUser.name.toUpperCase().replace(/\s+/g, '_') : 'PANKAJ_KUMAR'} // {currentUser?.role ? currentUser.role.toUpperCase().slice(0, 16) : 'BACKEND'}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Center: Clean Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
            {workbenchNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer whitespace-nowrap ${
                    isActive
                      ? 'bg-[#181822] text-white border border-[#2B2B38] shadow-sm font-semibold'
                      : 'text-[#8E8E9B] hover:text-white hover:bg-[#111116]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#FF5A36]' : 'text-[#8E8E9B]'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88] animate-ping" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right: User Switcher, Theme Toggle, Telegram Quick Link & Notification Icon */}
          <div className="flex items-center gap-2 shrink-0">
            {/* User Account / Profile Switcher Pill */}
            {onOpenAuthModal && (
              <button
                id="navbar-user-switch-btn"
                onClick={onOpenAuthModal}
                title="Switch Profile / Account Credentials"
                className="flex items-center gap-2 px-2.5 py-1.5 rounded-xl bg-[#111116] hover:bg-[#181822] text-white border border-[#1D1D24] hover:border-[#FF5A36]/60 text-xs transition-all cursor-pointer select-none"
              >
                <div className="w-5 h-5 rounded-md bg-gradient-to-br from-[#FF5A36] to-[#FF3D14] flex items-center justify-center text-white font-mono font-bold text-[10px] shrink-0">
                  {currentUser?.name ? currentUser.name.slice(0, 2).toUpperCase() : 'PK'}
                </div>
                <div className="hidden sm:flex flex-col items-start leading-none text-left">
                  <span className="text-[11px] font-bold text-white max-w-[100px] truncate">
                    {currentUser?.name || 'Pankaj Kumar'}
                  </span>
                  <span className="text-[9px] text-[#8E8E9B] font-mono">
                    {currentUser?.isPrimary ? 'PRIMARY' : 'PRIVATE'}
                  </span>
                </div>
              </button>
            )}

            {/* 1-Click Telegram Quick Connect Pill */}
            <button
              onClick={onOpenTelegramModal}
              title="Connect Telegram Alerts"
              className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#111116] hover:bg-[#181822] text-[#8E8E9B] hover:text-white border border-[#1D1D24] text-xs font-mono transition-all cursor-pointer"
            >
              <Send className="w-3.5 h-3.5 text-[#FF5A36]" />
              <span className="hidden lg:inline text-[11px]">Telegram</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#00FF88]" />
            </button>

            {/* Dark / Light Theme Toggle Button */}
            {onToggleTheme && (
              <button
                id="theme-toggle-btn"
                onClick={onToggleTheme}
                title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                className="p-2 rounded-xl bg-[#111116] hover:bg-[#181820] text-[#8E8E9B] hover:text-white transition-all border border-[#1D1D24] cursor-pointer"
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun className="w-4 h-4 text-[#FF5A36] transition-transform hover:rotate-45" />
                ) : (
                  <Moon className="w-4 h-4 text-[#FF5A36] transition-transform hover:-rotate-12" />
                )}
              </button>
            )}

            {/* Notifications Popover Trigger */}
            <div className="relative">
              <button
                id="navbar-notification-btn"
                onClick={() => setShowNotifPopover(!showNotifPopover)}
                className="relative p-2 rounded-xl bg-[#111116] hover:bg-[#181820] text-[#8E8E9B] hover:text-white transition-all border border-[#1D1D24] cursor-pointer"
                aria-label="View notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#FF5A36] text-white text-[9px] font-mono font-bold flex items-center justify-center">
                    {unreadCount}
                  </span>
                )}
              </button>

              {/* Popover Drawer */}
              <AnimatePresence>
                {showNotifPopover && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-[#111116] border border-[#1D1D24] shadow-2xl p-4 z-50 space-y-3 text-white"
                  >
                    <div className="flex items-center justify-between border-b border-[#1D1D24] pb-2.5">
                      <div className="flex items-center gap-2">
                        <Bell className="w-4 h-4 text-[#FF5A36]" />
                        <span className="font-bold text-xs font-display text-white">Live Telemetry Alerts</span>
                      </div>
                      {notifications.length > 0 && (
                        <button
                          onClick={onClearNotifications}
                          className="text-[11px] text-[#8E8E9B] hover:text-white font-mono"
                        >
                          Clear All
                        </button>
                      )}
                    </div>

                    <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                      {notifications.length === 0 ? (
                        <div className="text-center py-6 text-xs text-[#8E8E9B] font-mono">
                          No pending alerts. All telemetry nominal.
                        </div>
                      ) : (
                        notifications.map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => {
                              onMarkNotificationRead(notif.id);
                              if (notif.data?.applicationId && onOpenApplication) {
                                onOpenApplication(notif.data.applicationId);
                                setShowNotifPopover(false);
                              }
                            }}
                            className={`p-3 rounded-xl border text-xs cursor-pointer transition-all ${
                              notif.read
                                ? 'bg-[#0D0D12] border-[#1D1D24] opacity-70'
                                : 'bg-[#14141E] border-[#FF5A36]/40'
                            }`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="font-bold text-white line-clamp-1">{notif.title}</span>
                              <span className="text-[10px] text-[#5A5A66] font-mono shrink-0">
                                {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-[11px] text-[#CCCCCC] leading-relaxed line-clamp-2">{notif.body}</p>
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
      </div>

      {/* Mobile Bottom Tab Row */}
      <div className="md:hidden flex items-center justify-around border-t border-[#1D1D24] bg-[#0A0A0E] py-2 px-2 overflow-x-auto">
        {workbenchNavItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center gap-1 py-1 px-2.5 rounded-lg text-[10px] font-mono ${
                isActive ? 'text-[#FF5A36] font-bold' : 'text-[#8E8E9B]'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </header>
  );
};
