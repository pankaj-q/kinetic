import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { DeveloperLandingPage } from './components/DeveloperLandingPage';
import { DashboardView } from './components/DashboardView';
import { JobsView } from './components/JobsView';
import { ApplicationsView } from './components/ApplicationsView';
import { ApplicationApprovalModal } from './components/ApplicationApprovalModal';
import { AgentConsoleView } from './components/AgentConsoleView';
import { ProfileView } from './components/ProfileView';
import { CoverLettersView } from './components/CoverLettersView';
import { EmailMonitorView } from './components/EmailMonitorView';
import { SettingsView } from './components/SettingsView';
import { TelegramConnectModal } from './components/TelegramConnectModal';
import { AuthModal } from './components/AuthModal';
import {
  CandidateProfile,
  Job,
  JobMatch,
  PreparedApplication,
  AgentRunSession,
  CoverLetter,
  EmailEvent,
  TelegramConfig,
  SchedulerConfig,
  EmailDispatchConfig,
  DashboardStats,
  NotificationMessage,
  ApplicationFormField,
  ApplicationStatus,
  User,
  AuthResponse,
} from './types';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('landing');
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    const saved = localStorage.getItem('kinetic_theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
      root.classList.remove('light');
    } else {
      root.classList.add('light');
      root.classList.remove('dark');
    }
    localStorage.setItem('kinetic_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Core Data States
  const [authToken, setAuthToken] = useState<string>(() => {
    return localStorage.getItem('kinetic_auth_token') || 'token_usr_pankaj_default';
  });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showAuthModal, setShowAuthModal] = useState(false);

  // Authenticated fetch helper
  const authFetch = useCallback(
    async (url: string, options: RequestInit = {}) => {
      const headers = new Headers(options.headers || {});
      if (authToken) {
        headers.set('Authorization', `Bearer ${authToken}`);
      }
      return fetch(url, { ...options, headers });
    },
    [authToken]
  );

  const [profile, setProfile] = useState<CandidateProfile | null>(null);
  const [jobs, setJobs] = useState<(Job & { match?: JobMatch; applicationId?: string; applicationStatus?: string })[]>([]);
  const [applications, setApplications] = useState<PreparedApplication[]>([]);
  const [agentSessions, setAgentSessions] = useState<AgentRunSession[]>([]);
  const [activeAgentSession, setActiveAgentSession] = useState<AgentRunSession | null>(null);
  const [coverLetters, setCoverLetters] = useState<CoverLetter[]>([]);
  const [emails, setEmails] = useState<EmailEvent[]>([]);
  const [telegramConfig, setTelegramConfig] = useState<TelegramConfig>({
    enabled: false,
    botToken: '',
    chatId: '',
    notifyOnHighMatch: true,
    notifyOnPrepared: true,
    notifyOnSubmitted: true,
    notifyOnInterview: true,
  });
  const [schedulerConfig, setSchedulerConfig] = useState<SchedulerConfig>({
    intervalMinutes: 30,
    active: true,
    minMatchScoreForAutoPrepare: 80,
    dailyMorningTime: '10:00',
    minJobsToApplyDaily: 5,
  });
  const [emailConfig, setEmailConfig] = useState<EmailDispatchConfig>({
    enabled: true,
    recipientEmail: 'codepankaj84@gmail.com',
    senderName: 'Kinetic Autonomous AI',
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: '',
    useTls: true,
    sendDailyMorningDigest: true,
  });
  const [stats, setStats] = useState<DashboardStats>({
    totalJobsFound: 0,
    newMatchesCount: 0,
    strongMatchesCount: 0,
    totalApplications: 0,
    waitingApprovalCount: 0,
    appliedCount: 0,
    interviewCount: 0,
    offersCount: 0,
    averageMatchScore: 0,
    recentActivity: [],
  });
  const [notifications, setNotifications] = useState<NotificationMessage[]>([]);

  // Selected Application for Approval Modal
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [showTelegramModal, setShowTelegramModal] = useState(false);
  const [isAgentRunning, setIsAgentRunning] = useState(false);

  // Sync current user on token changes
  useEffect(() => {
    authFetch('/api/auth/me')
      .then((r) => r.json())
      .then((user) => {
        if (user && user.id) {
          setCurrentUser(user);
        }
      })
      .catch((err) => console.error('Failed to load current user:', err));
  }, [authToken, authFetch]);

  const handleAuthSuccess = (authData: AuthResponse) => {
    setAuthToken(authData.token);
    setCurrentUser(authData.user);
    localStorage.setItem('kinetic_auth_token', authData.token);
  };

  // Fetch all data scoped to active user
  const fetchData = useCallback(async () => {
    try {
      const [
        profileRes,
        jobsRes,
        appsRes,
        statsRes,
        notifsRes,
        tgRes,
        schedRes,
        emailsRes,
        sessionsRes,
        emailConfigRes,
      ] = await Promise.all([
        authFetch('/api/resume/profile').then((r) => r.json()),
        authFetch('/api/jobs').then((r) => r.json()),
        authFetch('/api/applications').then((r) => r.json()),
        authFetch('/api/dashboard/stats').then((r) => r.json()),
        authFetch('/api/notifications').then((r) => r.json()),
        authFetch('/api/notifications/telegram/config').then((r) => r.json()),
        authFetch('/api/scheduler').then((r) => r.json()),
        authFetch('/api/email/inbox').then((r) => r.json()),
        authFetch('/api/agent/sessions').then((r) => r.json()),
        authFetch('/api/email/config').then((r) => r.json()).catch(() => null),
      ]);

      setProfile(profileRes);
      setJobs(jobsRes || []);
      setApplications(appsRes || []);
      setStats(statsRes || {});
      setNotifications(notifsRes || []);
      setTelegramConfig(tgRes || {});
      setSchedulerConfig(schedRes || {});
      setEmails(emailsRes || []);
      setAgentSessions(sessionsRes || []);
      if (emailConfigRes) {
        setEmailConfig(emailConfigRes);
      }

      // Build cover letters list from applications
      const extractedLetters: CoverLetter[] = (appsRes || [])
        .filter((a: PreparedApplication) => a.coverLetterContent)
        .map((a: PreparedApplication) => ({
          id: a.coverLetterId || `cl_${a.id}`,
          jobId: a.jobId,
          candidateProfileId: a.candidateProfileId,
          company: a.company,
          jobTitle: a.jobTitle,
          content: a.coverLetterContent || '',
          tone: 'professional',
          generatedAt: a.createdAt,
        }));
      setCoverLetters(extractedLetters);
    } catch (err) {
      console.error('Failed to fetch Kinetic data:', err);
    } finally {
      setLoading(false);
    }
  }, [authFetch]);

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000); // Polling every 15s for live status updates
    return () => clearInterval(interval);
  }, [fetchData]);

  // Actions
  const handleOpenApplication = (appId: string) => {
    setSelectedAppId(appId);
  };

  const handleCloseApplicationModal = () => {
    setSelectedAppId(null);
  };

  const handleApproveApplication = async (
    appId: string,
    editedFields: ApplicationFormField[],
    editedCoverLetter: string
  ) => {
    try {
      const res = await authFetch(`/api/applications/${appId}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ editedFields, editedCoverLetter }),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Error approving application:', err);
    }
  };

  const handleUpdateApplicationStatus = async (appId: string, status: ApplicationStatus) => {
    try {
      await authFetch(`/api/applications/${appId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      await fetchData();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const handleDeleteApplication = async (appId: string) => {
    try {
      await authFetch(`/api/applications/${appId}`, { method: 'DELETE' });
      await fetchData();
    } catch (err) {
      console.error('Error deleting application:', err);
    }
  };

  const handlePrepareApplication = async (jobId: string) => {
    try {
      const res = await authFetch('/api/applications/prepare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId }),
      });
      const newApp = await res.json();
      await fetchData();
      if (newApp?.id) {
        setSelectedAppId(newApp.id);
      }
    } catch (err) {
      console.error('Error preparing application:', err);
    }
  };

  const handleMatchJob = async (jobId: string) => {
    try {
      await authFetch(`/api/jobs/${jobId}/match`, { method: 'POST' });
      await fetchData();
    } catch (err) {
      console.error('Error matching job:', err);
    }
  };

  const handleMatchAllJobs = async () => {
    try {
      await authFetch('/api/jobs/match-all', { method: 'POST' });
      await fetchData();
    } catch (err) {
      console.error('Error matching all jobs:', err);
    }
  };

  const handleSearchIngestJobs = async (query?: string, sources?: string[]) => {
    try {
      await authFetch('/api/jobs/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query, sources }),
      });
      await fetchData();
    } catch (err) {
      console.error('Error searching jobs:', err);
    }
  };

  const handleIngestCustomJob = async (data: { url?: string; rawText?: string }) => {
    try {
      const res = await authFetch('/api/jobs/ingest-custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error('Error ingesting custom job:', err);
    }
  };

  const handleRunAgent = async (goal: string, minMatchScore: number) => {
    setIsAgentRunning(true);
    try {
      const res = await authFetch('/api/agent/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal, minMatchScore }),
      });
      const session = await res.json();
      setActiveAgentSession(session);
      await fetchData();
    } catch (err) {
      console.error('Error executing agent:', err);
    } finally {
      setIsAgentRunning(false);
    }
  };

  const handleSaveProfile = async (updated: CandidateProfile) => {
    try {
      await authFetch('/api/resume/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      setProfile(updated);
    } catch (err) {
      console.error('Error saving profile:', err);
    }
  };

  const handleParseResume = async (resumeText: string) => {
    try {
      const res = await authFetch('/api/resume/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText }),
      });
      const data = await res.json();
      if (data.profile) {
        setProfile(data.profile);
      }
      await fetchData();
    } catch (err) {
      console.error('Error parsing resume:', err);
    }
  };

  const handleGenerateCoverLetter = async (jobId: string, tone: any) => {
    try {
      const res = await authFetch('/api/cover-letter/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ jobId, tone }),
      });
      const newLetter = await res.json();
      setCoverLetters((prev) => [newLetter, ...prev]);
      setActiveTab('cover-letters');
    } catch (err) {
      console.error('Error generating letter:', err);
    }
  };

  const handleSimulateEmail = async (type: 'interview' | 'rejection' | 'offer' | 'screening', company?: string) => {
    try {
      await authFetch('/api/email/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, company }),
      });
      await fetchData();
    } catch (err) {
      console.error('Error simulating email:', err);
    }
  };

  const handleProcessRawEmail = async (raw: { sender: string; recipient: string; subject: string; body: string }) => {
    try {
      await authFetch('/api/email/process', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ raw }),
      });
      await fetchData();
    } catch (err) {
      console.error('Error processing email:', err);
    }
  };

  const handleSaveTelegram = async (config: TelegramConfig) => {
    try {
      await authFetch('/api/notifications/telegram/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      setTelegramConfig(config);
    } catch (err) {
      console.error('Error saving telegram config:', err);
    }
  };

  const handleTestTelegram = async () => {
    try {
      const res = await authFetch('/api/notifications/telegram/test', { method: 'POST' });
      const data = await res.json().catch(() => ({}));
      await fetchData();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to deliver message to Telegram');
      }
      return data;
    } catch (err) {
      console.error('Error testing telegram:', err);
      throw err;
    }
  };

  const handleSaveScheduler = async (config: SchedulerConfig) => {
    try {
      await authFetch('/api/scheduler', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      setSchedulerConfig(config);
    } catch (err) {
      console.error('Error saving scheduler:', err);
    }
  };

  const handleSaveEmailConfig = async (config: EmailDispatchConfig) => {
    try {
      await authFetch('/api/email/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
      setEmailConfig(config);
    } catch (err) {
      console.error('Error saving email config:', err);
    }
  };

  const handleTestEmail = async (recipientEmail?: string) => {
    try {
      const res = await authFetch('/api/email/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ recipientEmail: recipientEmail || emailConfig.recipientEmail }),
      });
      await fetchData();
      return await res.json();
    } catch (err) {
      console.error('Error sending test email:', err);
      throw err;
    }
  };

  const handleRunMorningRoutineNow = async (targetCount: number = 5, autoSubmit: boolean = true) => {
    setIsAgentRunning(true);
    try {
      const res = await authFetch('/api/scheduler/morning-routine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetCount, autoSubmit }),
      });
      const data = await res.json();
      if (data.session) {
        setActiveAgentSession(data.session);
      }
      await fetchData();
      return data;
    } catch (err) {
      console.error('Error running morning routine:', err);
      throw err;
    } finally {
      setIsAgentRunning(false);
    }
  };

  const handleTriggerSchedulerNow = async () => {
    try {
      await authFetch('/api/scheduler/trigger-now', { method: 'POST' });
      await fetchData();
    } catch (err) {
      console.error('Error triggering scheduler:', err);
    }
  };

  const handleResetDemo = async () => {
    try {
      await authFetch('/api/reset-demo', { method: 'POST' });
      await fetchData();
    } catch (err) {
      console.error('Error resetting demo:', err);
    }
  };

  const handleMarkNotificationRead = async (id: string) => {
    try {
      await authFetch(`/api/notifications/${id}/read`, { method: 'PATCH' });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error('Error marking notif read:', err);
    }
  };

  const handleClearNotifications = async () => {
    try {
      await authFetch('/api/notifications/clear', { method: 'POST' });
      setNotifications([]);
    } catch (err) {
      console.error('Error clearing notifications:', err);
    }
  };

  const unreadNotifCount = notifications.filter((n) => !n.read).length;
  const currentSelectedApp = applications.find((a) => a.id === selectedAppId) || null;

  if (loading && !profile) {
    return (
      <div className="min-h-screen bg-[#070709] text-[#FFFFFF] flex items-center justify-center font-['Geist',sans-serif]">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#111116] border border-[#1D1D24] flex items-center justify-center mx-auto shadow-xs animate-pulse">
            <span className="text-[#FF5A36] font-extrabold text-lg tracking-tight font-mono">K</span>
          </div>
          <h2 className="text-sm font-semibold text-[#8E8E9B] tracking-tight">Initializing Kinetic Autonomous Engine...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#070709] text-[#FFFFFF] flex flex-col font-['Geist',sans-serif] selection:bg-[#FF5A36]/30 selection:text-[#FF5A36]">
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        notifications={notifications}
        unreadCount={unreadNotifCount}
        telegramConfig={telegramConfig}
        onMarkNotificationRead={handleMarkNotificationRead}
        onClearNotifications={handleClearNotifications}
        onOpenApplication={handleOpenApplication}
        isAgentRunning={isAgentRunning}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onOpenTelegramModal={() => setShowTelegramModal(true)}
        currentUser={currentUser}
        onOpenAuthModal={() => setShowAuthModal(true)}
      />

      {/* Main App Body with Smooth Page Transitions */}
      {activeTab === 'landing' ? (
        <DeveloperLandingPage
          onEnterApp={() => setActiveTab('dashboard')}
          onNavigateTab={setActiveTab}
          onRunMorningRoutine={handleRunMorningRoutineNow}
          profile={profile}
          jobs={jobs}
          applications={applications}
          telegramConfig={telegramConfig}
          schedulerConfig={schedulerConfig}
          onOpenTelegramModal={() => setShowTelegramModal(true)}
        />
      ) : (
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            >
              {activeTab === 'dashboard' && (
                <DashboardView
                  stats={stats}
                  jobs={jobs}
                  applications={applications}
                  profile={profile}
                  onNavigateTab={setActiveTab}
                  onOpenApplication={handleOpenApplication}
                  onRunAgent={handleRunAgent}
                  onRunMorningRoutine={handleRunMorningRoutineNow}
                  isAgentRunning={isAgentRunning}
                  onOpenTelegramModal={() => setShowTelegramModal(true)}
                />
              )}

            {activeTab === 'jobs' && (
              <JobsView
                jobs={jobs}
                onSearchIngest={handleSearchIngestJobs}
                onIngestCustomJob={handleIngestCustomJob}
                onMatchJob={handleMatchJob}
                onMatchAll={handleMatchAllJobs}
                onPrepareApplication={handlePrepareApplication}
                onOpenApplication={handleOpenApplication}
                onGenerateCoverLetter={(jobId) => handleGenerateCoverLetter(jobId, 'professional')}
              />
            )}

            {activeTab === 'applications' && (
              <ApplicationsView
                applications={applications}
                onOpenApplication={handleOpenApplication}
                onUpdateStatus={handleUpdateApplicationStatus}
                onDeleteApplication={handleDeleteApplication}
                onNavigateTab={setActiveTab}
              />
            )}

            {activeTab === 'agent' && (
              <AgentConsoleView
                sessions={agentSessions}
                activeSession={activeAgentSession}
                onRunAgent={handleRunAgent}
                onRunMorningRoutine={handleRunMorningRoutineNow}
                isAgentRunning={isAgentRunning}
                onNavigateTab={setActiveTab}
                onOpenApplication={handleOpenApplication}
              />
            )}

            {activeTab === 'profile' && profile && (
              <ProfileView
                profile={profile}
                onSaveProfile={handleSaveProfile}
                onParseResume={handleParseResume}
              />
            )}

            {activeTab === 'cover-letters' && (
              <CoverLettersView
                coverLetters={coverLetters}
                jobs={jobs}
                onGenerate={handleGenerateCoverLetter}
              />
            )}

            {activeTab === 'email-monitor' && (
              <EmailMonitorView
                emails={emails}
                onSimulateEmail={handleSimulateEmail}
                onProcessRawEmail={handleProcessRawEmail}
                onOpenApplication={handleOpenApplication}
              />
            )}

            {activeTab === 'settings' && (
              <SettingsView
                telegramConfig={telegramConfig}
                schedulerConfig={schedulerConfig}
                emailConfig={emailConfig}
                onSaveTelegram={handleSaveTelegram}
                onTestTelegram={handleTestTelegram}
                onSaveScheduler={handleSaveScheduler}
                onTriggerSchedulerNow={handleTriggerSchedulerNow}
                onRunMorningRoutineNow={handleRunMorningRoutineNow}
                onSaveEmailConfig={handleSaveEmailConfig}
                onTestEmail={handleTestEmail}
                onResetDemo={handleResetDemo}
                theme={theme}
                onToggleTheme={handleToggleTheme}
                currentUser={currentUser}
                onOpenAuthModal={() => setShowAuthModal(true)}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
      )}

      {/* Human-In-The-Loop Approval Modal */}
      {selectedAppId && currentSelectedApp && (
        <ApplicationApprovalModal
          application={currentSelectedApp}
          onClose={handleCloseApplicationModal}
          onApprove={handleApproveApplication}
          onUpdateStatus={handleUpdateApplicationStatus}
        />
      )}

      {/* 1-Click Easy Telegram Connection Modal */}
      <TelegramConnectModal
        isOpen={showTelegramModal}
        onClose={() => setShowTelegramModal(false)}
        telegramConfig={telegramConfig}
        onSaveTelegram={handleSaveTelegram}
        onTestTelegram={handleTestTelegram}
      />

      {/* Multi-User Account & Workspace Modal */}
      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        currentUser={currentUser}
        onAuthSuccess={handleAuthSuccess}
      />
    </div>
  );
}

export default App;
