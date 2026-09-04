import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  X,
  User as UserIcon,
  Shield,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  Mail,
  Briefcase,
  Users,
  KeyRound,
  Loader2,
  ChevronRight,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { User, AuthResponse } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: User | null;
  onAuthSuccess: (authData: AuthResponse) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onAuthSuccess,
}) => {
  if (!isOpen) return null;

  const [tab, setTab] = useState<'switch' | 'login' | 'register'>('switch');
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('Senior Backend Software Engineer');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const res = await fetch('/api/auth/users');
      if (res.ok) {
        const users = await res.json();
        setAllUsers(users);
      }
    } catch (err) {
      console.error('Failed to load users:', err);
    } finally {
      setLoadingUsers(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError('Please provide a valid email address.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim() || 'New Candidate',
          email: email.trim().toLowerCase(),
          role: role.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to create account');
      }
      onAuthSuccess(data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!email.trim()) {
      setError('Please provide your email address.');
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }
      onAuthSuccess(data);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSwitchAccount = async (targetUser: User) => {
    setSubmitting(true);
    try {
      const token = `token_${targetUser.id}`;
      onAuthSuccess({ user: targetUser, token });
      onClose();
    } catch (err) {
      console.error('Failed to switch user:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSwitchPrimary = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/switch-primary', { method: 'POST' });
      const data = await res.json();
      onAuthSuccess(data);
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const handleSwitchDemo = async () => {
    setSubmitting(true);
    try {
      const res = await fetch('/api/auth/switch-demo', { method: 'POST' });
      const data = await res.json();
      onAuthSuccess(data);
      onClose();
    } finally {
      setSubmitting(false);
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
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold font-display text-white">Multi-User Account Center</h2>
              <p className="text-xs text-[#8E8E9B]">
                Isolated profiles, Telegram credentials, and application pipelines
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

        {/* Navigation Tabs */}
        <div className="flex border-b border-[#1D1D24] bg-[#0D0D12] px-6 pt-2 gap-2">
          <button
            onClick={() => { setTab('switch'); setError(null); }}
            className={`pb-3 px-3 text-xs font-semibold cursor-pointer border-b-2 transition-all ${
              tab === 'switch'
                ? 'text-[#FF5A36] border-[#FF5A36]'
                : 'text-[#8E8E9B] border-transparent hover:text-white'
            }`}
          >
            Switch Profile ({allUsers.length || 1})
          </button>
          <button
            onClick={() => { setTab('register'); setError(null); }}
            className={`pb-3 px-3 text-xs font-semibold cursor-pointer border-b-2 transition-all ${
              tab === 'register'
                ? 'text-[#FF5A36] border-[#FF5A36]'
                : 'text-[#8E8E9B] border-transparent hover:text-white'
            }`}
          >
            Create New Account
          </button>
          <button
            onClick={() => { setTab('login'); setError(null); }}
            className={`pb-3 px-3 text-xs font-semibold cursor-pointer border-b-2 transition-all ${
              tab === 'login'
                ? 'text-[#FF5A36] border-[#FF5A36]'
                : 'text-[#8E8E9B] border-transparent hover:text-white'
            }`}
          >
            Sign In with Email
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-950/30 border border-rose-800/50 text-xs text-rose-300 font-mono">
              {error}
            </div>
          )}

          {/* TAB 1: SWITCH PROFILE */}
          {tab === 'switch' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-[#8E8E9B] mb-1">
                <span>ACTIVE PROFILES & WORKSPACES</span>
                <span className="text-[10px] text-[#00FF88]">100% Credential Isolation</span>
              </div>

              {/* Primary User Card (Pankaj Kumar) */}
              <div
                onClick={handleSwitchPrimary}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  currentUser?.isPrimary || currentUser?.id === 'usr_pankaj_default'
                    ? 'bg-[#181824] border-[#FF5A36]/60 shadow-sm shadow-[#FF5A36]/10'
                    : 'bg-[#0D0D12] border-[#1D1D24] hover:border-[#353545]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FF5A36] to-[#FF3D14] flex items-center justify-center text-white font-mono font-bold text-sm">
                    PK
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white font-display">Pankaj Kumar</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#FF5A36]/20 text-[#FF5A36] border border-[#FF5A36]/40">
                        PRIMARY
                      </span>
                    </div>
                    <p className="text-xs text-[#8E8E9B]">
                      Senior Backend Engineer • codepankaj84@gmail.com
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-mono text-[#FF5A36]">
                  {currentUser?.isPrimary || currentUser?.id === 'usr_pankaj_default' ? (
                    <span className="flex items-center gap-1 text-[#00FF88]">
                      <CheckCircle2 className="w-4 h-4" />
                      Active
                    </span>
                  ) : (
                    <span>Switch &rarr;</span>
                  )}
                </div>
              </div>

              {/* Demo User Card */}
              <div
                onClick={handleSwitchDemo}
                className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  currentUser?.id === 'usr_demo_evaluator'
                    ? 'bg-[#181824] border-[#FF5A36]/60 shadow-sm shadow-[#FF5A36]/10'
                    : 'bg-[#0D0D12] border-[#1D1D24] hover:border-[#353545]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#20202E] border border-[#2B2B38] flex items-center justify-center text-white font-mono font-bold text-sm">
                    AR
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-white font-display">Alex Reed</span>
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-[#20202E] text-[#8E8E9B] border border-[#2B2B38]">
                        EVALUATOR DEMO
                      </span>
                    </div>
                    <p className="text-xs text-[#8E8E9B]">
                      Full Stack Engineer • alex.reed@techcareer.io
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-mono text-[#FF5A36]">
                  {currentUser?.id === 'usr_demo_evaluator' ? (
                    <span className="flex items-center gap-1 text-[#00FF88]">
                      <CheckCircle2 className="w-4 h-4" />
                      Active
                    </span>
                  ) : (
                    <span>Switch &rarr;</span>
                  )}
                </div>
              </div>

              {/* Other Created Users */}
              {allUsers
                .filter((u) => u.id !== 'usr_pankaj_default' && u.id !== 'usr_demo_evaluator')
                .map((u) => (
                  <div
                    key={u.id}
                    onClick={() => handleSwitchAccount(u)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      currentUser?.id === u.id
                        ? 'bg-[#181824] border-[#FF5A36]/60 shadow-sm shadow-[#FF5A36]/10'
                        : 'bg-[#0D0D12] border-[#1D1D24] hover:border-[#353545]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#181822] border border-[#262632] flex items-center justify-center text-white font-mono font-bold text-sm uppercase">
                        {u.name.slice(0, 2)}
                      </div>
                      <div>
                        <span className="text-sm font-bold text-white font-display block">{u.name}</span>
                        <p className="text-xs text-[#8E8E9B]">
                          {u.role || 'Software Engineer'} • {u.email}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1 text-xs font-mono text-[#FF5A36]">
                      {currentUser?.id === u.id ? (
                        <span className="flex items-center gap-1 text-[#00FF88]">
                          <CheckCircle2 className="w-4 h-4" />
                          Active
                        </span>
                      ) : (
                        <span>Switch &rarr;</span>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}

          {/* TAB 2: CREATE NEW ACCOUNT */}
          {tab === 'register' && (
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div>
                <label className="text-xs font-mono font-bold text-[#8E8E9B] uppercase tracking-wider block mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sarah Jenkins"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full text-xs text-white bg-[#070709] border border-[#1D1D24] rounded-lg p-3 font-mono focus:outline-none focus:border-[#FF5A36]"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-[#8E8E9B] uppercase tracking-wider block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. sarah.jenkins@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs text-white bg-[#070709] border border-[#1D1D24] rounded-lg p-3 font-mono focus:outline-none focus:border-[#FF5A36]"
                />
              </div>

              <div>
                <label className="text-xs font-mono font-bold text-[#8E8E9B] uppercase tracking-wider block mb-1">
                  Primary Role / Target Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Full Stack Engineer"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full text-xs text-white bg-[#070709] border border-[#1D1D24] rounded-lg p-3 font-mono focus:outline-none focus:border-[#FF5A36]"
                />
              </div>

              <div className="p-3 rounded-xl bg-[#0D0D12] border border-[#1D1D24] text-[11px] text-[#8E8E9B] space-y-1">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#00FF88]" />
                  100% Private Workspace
                </span>
                <p>
                  You will get your own isolated profile, private Telegram bot settings, custom cover letters, and application queue.
                </p>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-accent text-xs py-3 font-semibold disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                <span>{submitting ? 'Creating Private Workspace...' : 'Create Account & Start'}</span>
              </button>
            </form>
          )}

          {/* TAB 3: SIGN IN */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="space-y-3.5">
              <div>
                <label className="text-xs font-mono font-bold text-[#8E8E9B] uppercase tracking-wider block mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. codepankaj84@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full text-xs text-white bg-[#070709] border border-[#1D1D24] rounded-lg p-3 font-mono focus:outline-none focus:border-[#FF5A36]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full btn-accent text-xs py-3 font-semibold disabled:opacity-50 flex items-center justify-center gap-2 mt-2"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                <span>{submitting ? 'Signing in...' : 'Sign In to Workspace'}</span>
              </button>
            </form>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#1D1D24] flex items-center justify-between bg-[#14141B] text-xs text-[#8E8E9B] font-mono">
          <span>Current Active: <strong className="text-white">{currentUser?.name || 'Pankaj Kumar'}</strong></span>
          <button
            onClick={onClose}
            className="hover:text-white transition-colors"
          >
            Close
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
