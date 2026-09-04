export type RemotePreference = 'remote' | 'hybrid' | 'onsite' | 'any';

export type MatchRecommendation = 'strong_match' | 'good_match' | 'possible_match' | 'skip';

export type ApplicationStatus =
  | 'SAVED'
  | 'MATCHED'
  | 'READY_TO_APPLY'
  | 'APPLICATION_STARTED'
  | 'WAITING_FOR_APPROVAL'
  | 'APPLIED'
  | 'SCREENING'
  | 'INTERVIEW'
  | 'OFFER'
  | 'REJECTED'
  | 'WITHDRAWN';

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  highlights: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  graduationYear: string;
}

export interface CandidateProject {
  id: string;
  title: string;
  description: string;
  technologies: string[];
  link?: string;
}

export interface CandidateProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  summary: string;
  skills: string[];
  programmingLanguages: string[];
  frameworks: string[];
  databases: string[];
  toolsAndCloud: string[];
  preferredRoles: string[];
  preferredLocations: string[];
  remotePreference: RemotePreference;
  experience: WorkExperience[];
  education: Education[];
  projects: CandidateProject[];
  salaryPreference: {
    min: number | null;
    max: number | null;
    currency: string;
  };
  jobTypes: string[];
  excludedCompanies: string[];
  keywords: string[];
  yearsOfExperience: number;
  updatedAt: string;
}

export interface Job {
  id: string;
  externalId: string;
  source: 'Greenhouse' | 'Lever' | 'RemoteOK' | 'Arbeitnow' | 'Remotive' | 'LinkedIn' | 'Indeed' | 'Custom' | string;
  title: string;
  company: string;
  location: string;
  remote: boolean;
  jobType: 'Full-time' | 'Contract' | 'Part-time' | 'Internship' | string;
  description: string;
  url: string;
  salary?: {
    min?: number;
    max?: number;
    currency?: string;
    period?: 'year' | 'month' | 'hour';
  } | null;
  experienceRequiredYears?: number;
  skillsRequired: string[];
  postedAt: string;
  createdAt: string;
}

export interface JobMatch {
  id: string;
  jobId: string;
  candidateProfileId: string;
  score: number; // 0 - 100
  recommendation: MatchRecommendation;
  matchingSkills: string[];
  missingSkills: string[];
  reason: string;
  experienceFit: 'exceeds' | 'meets' | 'below';
  evaluatedAt: string;
}

export interface CoverLetter {
  id: string;
  jobId: string;
  candidateProfileId: string;
  company: string;
  jobTitle: string;
  content: string;
  tone: 'professional' | 'enthusiastic' | 'confident' | 'technical';
  highlightedProjects: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ApplicationFormField {
  fieldId: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'file';
  value: string | boolean;
  required: boolean;
  isAiGenerated: boolean;
  reasoning?: string;
  category?: 'personal' | 'experience' | 'custom_question' | 'legal';
}

export interface PreparedApplication {
  id: string;
  jobId: string;
  candidateProfileId: string;
  jobTitle: string;
  company: string;
  applicationUrl: string;
  status: ApplicationStatus;
  matchScore: number;
  coverLetterId?: string;
  coverLetterContent?: string;
  resumeVersion: string;
  formFields: ApplicationFormField[];
  notes: string;
  waitingForApproval: boolean;
  approvalRequestedAt?: string;
  approvedAt?: string;
  appliedAt?: string;
  interviewDate?: string;
  rejectionReason?: string;
  submissionScreenshot?: string;
  historyLogs: {
    status: ApplicationStatus;
    timestamp: string;
    note: string;
    source: 'agent' | 'user' | 'email_monitor';
  }[];
  createdAt: string;
  updatedAt: string;
}

export interface TelegramConfig {
  enabled: boolean;
  botToken: string;
  chatId: string;
  notifyOnHighMatch: boolean;
  minMatchScore: number;
  notifyOnApplicationReady: boolean;
  notifyOnSubmission: boolean;
  notifyOnInterview: boolean;
  notifyOnRejection: boolean;
  morningReportEnabled?: boolean;
}

export interface EmailDispatchConfig {
  enabled: boolean;
  recipientEmail: string;
  senderName: string;
  smtpHost?: string;
  smtpPort?: number;
  smtpUser?: string;
  smtpPassword?: string;
  useTls?: boolean;
  sendDailyMorningDigest: boolean;
}

export interface SchedulerConfig {
  active: boolean;
  scheduleType?: 'interval' | 'daily_morning' | 'both';
  dailyMorningTime?: string; // e.g. "10:00"
  minJobsToApplyDaily?: number; // e.g. 5
  autoSubmitOnMorning?: boolean; // true = submit directly, false = prepare for approval
  intervalMinutes: number; // e.g. 30 or 180
  preferredTimes: string[]; // e.g. ["10:00", "14:00", "19:00"]
  autoMatch: boolean;
  autoPrepareApplications: boolean;
  minMatchScoreForAutoPrepare: number;
  autoCheckEmails: boolean;
  lastRunAt?: string;
  nextRunAt?: string;
  lastMorningReportSentAt?: string;
}

export interface NotificationMessage {
  id: string;
  type: 'high_match' | 'application_prepared' | 'submission_success' | 'interview_detected' | 'rejection_detected' | 'system_alert';
  title: string;
  body: string;
  timestamp: string;
  read: boolean;
  data?: {
    jobId?: string;
    applicationId?: string;
    score?: number;
    company?: string;
    url?: string;
    count?: number;
    [key: string]: any;
  };
}

export interface EmailEvent {
  id: string;
  sender: string;
  recipient: string;
  subject: string;
  snippet: string;
  fullBody: string;
  receivedAt: string;
  classification: 'INTERVIEW' | 'REJECTION' | 'OFFER' | 'STATUS_UPDATE' | 'OTHER';
  confidenceScore: number;
  detectedCompany?: string;
  matchedApplicationId?: string;
  processed: boolean;
  actionTaken?: string;
}

export interface AgentActionLog {
  id: string;
  timestamp: string;
  step: number;
  thought: string;
  action: string;
  tool: string;
  input: any;
  output: any;
  status: 'running' | 'success' | 'failed' | 'waiting_approval';
}

export interface AgentRunSession {
  id: string;
  goal: string;
  status: 'idle' | 'running' | 'completed' | 'paused_for_approval' | 'error';
  currentStep: number;
  maxSteps: number;
  startedAt: string;
  completedAt?: string;
  logs: AgentActionLog[];
  metrics: {
    jobsScanned: number;
    jobsMatched: number;
    applicationsPrepared: number;
    coverLettersGenerated: number;
    notificationsSent: number;
  };
}

export interface DashboardStats {
  totalJobsScanned: number;
  newMatchesCount: number;
  strongMatchesCount: number;
  totalApplications: number;
  waitingApprovalCount: number;
  appliedCount: number;
  screeningCount: number;
  interviewCount: number;
  offersCount: number;
  rejectedCount: number;
  averageMatchScore: number;
  recentActivity: {
    id: string;
    type: string;
    message: string;
    time: string;
    badgeColor?: string;
  }[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  role?: string;
  isPrimary?: boolean;
  avatar?: string;
  createdAt: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

