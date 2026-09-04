import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  X,
  Send,
  Sparkles,
  CheckCircle2,
  ExternalLink,
  ShieldCheck,
  Zap,
  Loader2,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { TelegramConfig } from '../types';

interface TelegramConnectModalProps {
  isOpen: boolean;
  onClose: () => void;
  telegramConfig: TelegramConfig;
  onSaveTelegram: (config: TelegramConfig) => Promise<void>;
  onTestTelegram: () => Promise<void>;
}

export const TelegramConnectModal: React.FC<TelegramConnectModalProps> = ({
  isOpen,
  onClose,
  telegramConfig,
  onSaveTelegram,
  onTestTelegram,
}) => {
  if (!isOpen) return null;

  const [botToken, setBotToken] = useState(telegramConfig.botToken || '');
  const [chatId, setChatId] = useState(telegramConfig.chatId || '1276866292');
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [copiedStep, setCopiedStep] = useState<string | null>(null);

  const copyText = (stepId: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedStep(stepId);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const handleConnectAndTest = async () => {
    setIsSaving(true);
    setTestResult(null);
    try {
      const updatedConfig: TelegramConfig = {
        ...telegramConfig,
        enabled: true,
        botToken: botToken.trim(),
        chatId: chatId.trim(),
        morningReportEnabled: true,
        notifyOnHighMatch: true,
        notifyOnSubmission: true,
        notifyOnInterview: true,
      };

      await onSaveTelegram(updatedConfig);

      // Now test ping
      setIsTesting(true);
      await onTestTelegram();
      setTestResult({
        success: true,
        message: '⚡ Connected successfully! Verification test alert dispatched to your Telegram chat.',
      });
    } catch (err: any) {
      setTestResult({
        success: false,
        message: err.message || 'Failed to dispatch verification. Please check token & chat ID.',
      });
    } finally {
      setIsSaving(false);
      setIsTesting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-['Geist',sans-serif]"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ type: 'spring', stiffness: 350, damping: 28 }}
        className="relative w-full max-w-lg bg-[#111116] border border-[#1D1D24] rounded-2xl shadow-2xl overflow-hidden text-white"
      >
        {/* Header */}
        <div className="px-6 py-4.5 border-b border-[#1D1D24] flex items-center justify-between bg-[#14141B]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FF5A36]/10 border border-[#FF5A36]/30 flex items-center justify-center text-[#FF5A36]">
              <Send className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white">Connect Telegram Bot</h2>
              <p className="text-xs text-[#8E8E9B]">
                Receive 10:00 AM job digests & real-time interview alerts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg bg-[#181822] hover:bg-[#20202E] text-[#8E8E9B] hover:text-white transition-all border border-[#1D1D24] cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 3 Quick Steps Guide */}
        <div className="p-6 space-y-5">
          <div className="space-y-3">
            <span className="text-[11px] font-mono font-bold text-[#8E8E9B] uppercase tracking-wider block">
              Easy 2-Minute Setup:
            </span>

            {/* Step 1 */}
            <div className="p-3.5 rounded-xl bg-[#0D0D12] border border-[#1D1D24] flex items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#FF5A36] text-white text-[10px] flex items-center justify-center font-mono">1</span>
                  Create Bot with BotFather
                </span>
                <p className="text-[#8E8E9B] text-[11px]">Send /newbot to get your API Bot Token</p>
              </div>
              <a
                href="https://t.me/BotFather"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary-outline text-xs py-1.5 px-3 shrink-0 flex items-center gap-1 font-mono"
              >
                <span>Open BotFather</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* Step 2 */}
            <div className="p-3.5 rounded-xl bg-[#0D0D12] border border-[#1D1D24] flex items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <span className="w-4 h-4 rounded-full bg-[#FF5A36] text-white text-[10px] flex items-center justify-center font-mono">2</span>
                  Get Your Chat ID
                </span>
                <p className="text-[#8E8E9B] text-[11px]">Your Chat ID is <strong className="text-white font-mono">{chatId || '1276866292'}</strong></p>
              </div>
              <a
                href="https://t.me/userinfobot"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary-outline text-xs py-1.5 px-3 shrink-0 flex items-center gap-1 font-mono"
              >
                <span>Open userinfobot</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Form Inputs */}
          <div className="space-y-3.5 pt-2 border-t border-[#1D1D24]">
            <div>
              <label className="text-xs font-mono font-bold text-[#8E8E9B] block mb-1 uppercase tracking-wider">
                Telegram Bot Token
              </label>
              <input
                type="text"
                placeholder="e.g. 7123456789:AAFx9_exampleBotToken"
                value={botToken}
                onChange={(e) => setBotToken(e.target.value)}
                className="w-full text-xs text-white bg-[#070709] border border-[#1D1D24] rounded-lg p-3 font-mono focus:outline-none focus:border-[#FF5A36]"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono font-bold text-[#8E8E9B] uppercase tracking-wider">
                  Telegram Chat ID
                </label>
                <button
                  type="button"
                  onClick={() => setChatId('1276866292')}
                  className="text-[11px] text-[#FF5A36] hover:underline font-mono"
                >
                  Fill: 1276866292
                </button>
              </div>
              <input
                type="text"
                placeholder="e.g. 1276866292"
                value={chatId}
                onChange={(e) => setChatId(e.target.value)}
                className="w-full text-xs text-white bg-[#070709] border border-[#1D1D24] rounded-lg p-3 font-mono focus:outline-none focus:border-[#FF5A36]"
              />
            </div>
          </div>

          {testResult && (
            <div
              className={`p-3.5 rounded-xl border text-xs font-mono flex items-start gap-2.5 ${
                testResult.success
                  ? 'bg-[#00FF88]/10 text-[#00FF88] border-[#00FF88]/30'
                  : 'bg-rose-950/30 text-rose-300 border-rose-800/50'
              }`}
            >
              {testResult.success ? (
                <CheckCircle2 className="w-4 h-4 text-[#00FF88] shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              )}
              <span className="leading-relaxed">{testResult.message}</span>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-[#1D1D24] flex items-center justify-between bg-[#14141B]">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#181822] hover:bg-[#20202E] text-white text-xs font-semibold border border-[#1D1D24] transition-all cursor-pointer"
          >
            Close
          </button>

          <button
            onClick={handleConnectAndTest}
            disabled={isSaving || isTesting}
            className="btn-accent text-xs py-2 px-5 font-semibold disabled:opacity-50 flex items-center gap-2"
          >
            {isSaving || isTesting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Zap className="w-3.5 h-3.5" />
            )}
            <span>{isSaving || isTesting ? 'Connecting & Verifying...' : '⚡ Connect & Verify Alert'}</span>
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
