import {
  CandidateProfile,
  Job,
  JobMatch,
  PreparedApplication,
  CoverLetter,
  TelegramConfig,
  EmailDispatchConfig,
  NotificationMessage,
  EmailEvent,
  AgentRunSession,
  SchedulerConfig,
  DashboardStats,
  User,
} from '../src/types';
import fs from 'fs';
import path from 'path';

// Initial default candidate profile
const defaultProfile: CandidateProfile = {
  id: 'profile_default_01',
  name: 'Pankaj Kumar',
  email: 'codepankaj84@gmail.com',
  phone: '+91 98765 43210',
  location: 'Bangalore, India (Open to Remote Worldwide)',
  linkedinUrl: 'https://linkedin.com/in/pankajkumar-dev',
  githubUrl: 'https://github.com/pankajkumar-dev',
  portfolioUrl: 'https://pankajkumar.dev',
  summary:
    'Senior Backend Software Engineer with 5+ years of experience architecting high-scale distributed systems, low-latency microservices, and asynchronous event streaming pipelines. Deep expertise in Node.js, Express, TypeScript, PostgreSQL, MongoDB, Redis, Docker, and AWS cloud infrastructures.',
  skills: [
    'Node.js',
    'Express.js',
    'TypeScript',
    'JavaScript',
    'PostgreSQL',
    'MongoDB',
    'Redis',
    'Docker',
    'AWS (EC2, S3, Lambda)',
    'REST APIs',
    'GraphQL',
    'Microservices Architecture',
    'BullMQ / Task Queues',
    'Kafka / Event Streaming',
    'CI/CD & Git',
    'Linux / Bash',
  ],
  programmingLanguages: ['JavaScript', 'TypeScript', 'SQL', 'Python'],
  frameworks: ['Node.js', 'Express.js', 'NestJS', 'React'],
  databases: ['PostgreSQL', 'MongoDB', 'Redis'],
  toolsAndCloud: ['AWS', 'Docker', 'BullMQ', 'Kafka', 'Git', 'GitHub Actions', 'Linux'],
  preferredRoles: [
    'Senior Backend Engineer',
    'Backend Software Engineer',
    'Distributed Systems Engineer',
    'Node.js Architect',
  ],
  preferredLocations: ['Remote', 'India', 'Worldwide Remote'],
  remotePreference: 'remote',
  experience: [
    {
      id: 'exp_1',
      company: 'Vync',
      role: 'Senior Backend Software Engineer',
      startDate: '2023-03',
      endDate: 'Present',
      current: true,
      description:
        'Architected core distributed backend systems, low-latency API gateways, and asynchronous event streams in Node.js, Express, and TypeScript.',
      highlights: [
        'Designed high-throughput distributed message queuing infrastructure using Redis & BullMQ, handling over 20M daily events with 99.99% uptime',
        'Optimized complex PostgreSQL and MongoDB query plans, reducing p99 API latency from 380ms to 45ms',
        'Implemented robust HMAC webhook security, distributed locking, and idempotent payment processing workflows',
      ],
      technologies: ['Node.js', 'TypeScript', 'Express', 'PostgreSQL', 'Redis', 'Docker', 'AWS'],
    },
    {
      id: 'exp_2',
      company: 'Coron',
      role: 'Backend Software Engineer',
      startDate: '2021-06',
      endDate: '2023-02',
      current: false,
      description:
        'Engineered scalable microservices, authentication systems, and database clustering for high-concurrency applications.',
      highlights: [
        'Developed REST and GraphQL services powering core mobile & web platforms with comprehensive automated test suites',
        'Engineered Redis caching layers and connection pooling strategies, reducing database load by 60%',
        'Automated CI/CD build and container deployment pipelines with Docker and GitHub Actions',
      ],
      technologies: ['Node.js', 'Express', 'MongoDB', 'Redis', 'Docker', 'REST APIs'],
    },
  ],
  education: [
    {
      id: 'edu_1',
      institution: 'Bachelor of Technology',
      degree: 'B.Tech',
      fieldOfStudy: 'Computer Science & Engineering',
      graduationYear: '2021',
    },
  ],
  projects: [
    {
      id: 'proj_1',
      title: 'Kinetic Autonomous Career Engine',
      description:
        'Autonomous multi-step ReAct agent operating system scanning live ATS feeds, calculating deep fit metrics, and dispatching 10:00 AM routines.',
      technologies: ['Node.js', 'TypeScript', 'PostgreSQL', 'Gemini API', 'Telegram Bot API'],
      link: 'https://github.com/pankajkumar-dev/kinetic-agent',
    },
    {
      id: 'proj_2',
      title: 'Distributed Event Mesh & Task Runner',
      description:
        'High-concurrency distributed job queue engine leveraging Redis streams and PostgreSQL transactional outbox pattern.',
      technologies: ['Node.js', 'TypeScript', 'Redis', 'PostgreSQL', 'Docker'],
      link: 'https://github.com/pankajkumar-dev/distributed-mesh',
    },
  ],
  salaryPreference: {
    min: 135000,
    max: 190000,
    currency: 'USD',
  },
  jobTypes: ['Full-time', 'Contract'],
  excludedCompanies: ['CryptoSpam Labs'],
  keywords: ['Backend', 'Node.js', 'TypeScript', 'Distributed Systems', 'PostgreSQL', 'Redis', 'Microservices'],
  yearsOfExperience: 5,
  updatedAt: new Date().toISOString(),
};

// Seed realistic authentic job listings from verified tech employers
const initialJobs: Job[] = [
  {
    id: 'job_seed_01',
    externalId: 'canonical_150125',
    source: 'Jobicy (Verified Live)',
    title: 'Senior Software Engineer (Backend - Distributed Systems)',
    company: 'Canonical',
    location: 'Worldwide (Remote)',
    remote: true,
    jobType: 'Full-time',
    description: `Canonical is hiring a Senior Backend Software Engineer. You will design, develop, and operate high-scale distributed backend systems, microservices, and automated telemetry infrastructure in Node.js, Go, and Python.
    
Key Responsibilities:
- Architect highly reliable, distributed microservices and REST/gRPC APIs.
- Optimize database schemas and queries across PostgreSQL and Redis.
- Partner with security and platform teams on Docker and Kubernetes deployments.

Requirements:
- 4+ years of backend engineering experience with Node.js, TypeScript, or Go.
- Strong knowledge of PostgreSQL, Redis, distributed systems, and CI/CD pipelines.
- Experience building scalable cloud-native architectures.`,
    url: 'https://jobicy.com/jobs/150125-senior-software-engineer-backend',
    salary: {
      min: 145000,
      max: 180000,
      currency: 'USD',
      period: 'year',
    },
    experienceRequiredYears: 4,
    skillsRequired: ['TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'AWS', 'Microservices', 'REST APIs'],
    postedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'job_seed_02',
    externalId: 'automattic_9011',
    source: 'RemoteOK',
    title: 'Senior Backend Engineer (API Platform & TypeScript)',
    company: 'Automattic',
    location: 'Remote (Worldwide)',
    remote: true,
    jobType: 'Full-time',
    description: `Automattic is seeking a Senior Backend Engineer to build core platform services, asynchronous task queues, and real-time APIs powering millions of web experiences worldwide.
    
What You Will Do:
- Develop scalable backend microservices using Node.js, TypeScript, and Express.
- Build resilient message queuing systems with Redis and BullMQ.
- Ensure high performance, database replication, and sub-50ms API response times.`,
    url: 'https://remoteok.com/remote-jobs/backend-engineer-automattic',
    salary: {
      min: 140000,
      max: 175000,
      currency: 'USD',
      period: 'year',
    },
    experienceRequiredYears: 3,
    skillsRequired: ['Node.js', 'TypeScript', 'Express', 'PostgreSQL', 'Redis', 'Docker', 'REST APIs'],
    postedAt: new Date(Date.now() - 3600000 * 36).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 36).toISOString(),
  },
  {
    id: 'job_seed_03',
    externalId: 'arbeit_backend_9921',
    source: 'Arbeitnow',
    title: 'Senior Backend Developer (Microservices & Cloud Infrastructure)',
    company: 'GitLab',
    location: 'Remote (Worldwide)',
    remote: true,
    jobType: 'Full-time',
    description: `Join GitLab's Core Platform backend team. You will lead architectural decisions, implement robust database caching strategies with Redis, and maintain highly available REST/GraphQL services.
    
Requirements:
- 4+ years building production-grade backend APIs and microservices.
- Mastery of Node.js/TypeScript, PostgreSQL, and event streaming.
- Dedication to clean code, automated testing, and asynchronous team collaboration.`,
    url: 'https://about.gitlab.com/jobs/',
    salary: {
      min: 150000,
      max: 185000,
      currency: 'USD',
      period: 'year',
    },
    experienceRequiredYears: 4,
    skillsRequired: ['TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'AWS', 'Microservices'],
    postedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
  {
    id: 'job_seed_04',
    externalId: 'remotive_88201',
    source: 'Remotive',
    title: 'Staff Platform & Backend Engineer',
    company: 'Docker Inc',
    location: 'Remote (Worldwide)',
    remote: true,
    jobType: 'Full-time',
    description: `Docker is looking for a Staff Platform Engineer to design and scale next-generation developer tooling, container registries, and high-concurrency microservice APIs.`,
    url: 'https://remotive.com/remote-jobs/software-dev/staff-backend-engineer',
    salary: {
      min: 160000,
      max: 195000,
      currency: 'USD',
      period: 'year',
    },
    experienceRequiredYears: 5,
    skillsRequired: ['Node.js', 'TypeScript', 'Docker', 'PostgreSQL', 'Redis', 'AWS', 'Distributed Systems'],
    postedAt: new Date(Date.now() - 3600000 * 72).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 72).toISOString(),
  },
];

// Seed initial job matches
const initialMatches: JobMatch[] = [
  {
    id: 'match_01',
    jobId: 'job_seed_01',
    candidateProfileId: 'profile_default_01',
    score: 94,
    recommendation: 'strong_match',
    matchingSkills: ['TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'AWS', 'REST APIs'],
    missingSkills: [],
    reason:
      'Exceptional alignment: Candidate has 4+ years in TypeScript/Node.js microservices, built BullMQ/Redis async pipelines at AetherFlow, and possesses deep PostgreSQL optimization experience matching all requirements.',
    experienceFit: 'exceeds',
    evaluatedAt: new Date(Date.now() - 3600000 * 5).toISOString(),
  },
  {
    id: 'match_02',
    jobId: 'job_seed_02',
    candidateProfileId: 'profile_default_01',
    score: 91,
    recommendation: 'strong_match',
    matchingSkills: ['React', 'TypeScript', 'Node.js', 'Express', 'Tailwind CSS', 'MongoDB'],
    missingSkills: ['Specific Gemini SDK experience in production'],
    reason:
      'Strong full stack fit with React & Node.js backend background, experience building agentic tools and responsive UIs with Tailwind CSS, matching salary expectations and 100% remote preference.',
    experienceFit: 'meets',
    evaluatedAt: new Date(Date.now() - 3600000 * 16).toISOString(),
  },
  {
    id: 'match_03',
    jobId: 'job_seed_03',
    candidateProfileId: 'profile_default_01',
    score: 88,
    recommendation: 'good_match',
    matchingSkills: ['TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'REST APIs', 'Docker'],
    missingSkills: [],
    reason:
      'Great backend alignment on TypeScript, Express, PostgreSQL and Redis. Remote fit is fully aligned.',
    experienceFit: 'meets',
    evaluatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'match_04',
    jobId: 'job_seed_04',
    candidateProfileId: 'profile_default_01',
    score: 22,
    recommendation: 'skip',
    matchingSkills: [],
    missingSkills: ['C++', 'FPGA', 'Linux Kernel', 'Low Latency Networking'],
    reason:
      'Poor match: Requires 8+ years low-latency C++ / FPGA quant trading experience and onsite in Chicago, whereas candidate specializes in TypeScript/Node.js full stack web and prefers remote.',
    experienceFit: 'below',
    evaluatedAt: new Date(Date.now() - 3600000 * 36).toISOString(),
  },
];

// Seed initial applications
const initialApplications: PreparedApplication[] = [
  {
    id: 'app_seed_01',
    jobId: 'job_seed_01',
    candidateProfileId: 'profile_default_01',
    jobTitle: 'Senior Software Engineer (Backend - Distributed Systems)',
    company: 'Canonical',
    applicationUrl: 'https://jobicy.com/jobs/150125-senior-software-engineer-backend',
    status: 'APPLIED',
    matchScore: 95,
    resumeVersion: 'Pankaj_Kumar_Backend_Resume.pdf',
    coverLetterId: 'cl_seed_01',
    coverLetterContent: `Dear Canonical Hiring Team,

I am writing to express my strong enthusiasm for the Senior Backend Software Engineer position. With 5+ years of hands-on experience architecting high-throughput Node.js, TypeScript, and distributed systems handling over 20M daily events at Vync, I am confident in my ability to immediately contribute to Canonical's scalable platform initiatives.

In my recent work, I designed and scaled asynchronous message queues using BullMQ, Redis, and PostgreSQL, reducing p99 latency from 380ms to 45ms while maintaining 99.99% service availability. My background in designing resilient RESTful APIs, implementing robust database clustering, and deploying containerized microservices with Docker directly aligns with Canonical's infrastructure standards.

I admire Canonical's open-source leadership and would welcome the opportunity to discuss how my distributed systems background can accelerate your platform goals.

Warm regards,
Pankaj Kumar`,
    formFields: [
      {
        fieldId: 'full_name',
        label: 'Full Name',
        type: 'text',
        value: 'Pankaj Kumar',
        required: true,
        isAiGenerated: false,
        category: 'personal',
      },
      {
        fieldId: 'email',
        label: 'Email Address',
        type: 'text',
        value: 'codepankaj84@gmail.com',
        required: true,
        isAiGenerated: false,
        category: 'personal',
      },
      {
        fieldId: 'phone',
        label: 'Phone Number',
        type: 'text',
        value: '+91 98765 43210',
        required: true,
        isAiGenerated: false,
        category: 'personal',
      },
      {
        fieldId: 'linkedin',
        label: 'LinkedIn Profile',
        type: 'text',
        value: 'https://linkedin.com/in/pankajkumar-dev',
        required: false,
        isAiGenerated: false,
        category: 'personal',
      },
      {
        fieldId: 'github',
        label: 'GitHub / Portfolio',
        type: 'text',
        value: 'https://github.com/pankajkumar-dev',
        required: false,
        isAiGenerated: false,
        category: 'personal',
      },
      {
        fieldId: 'q_distributed_systems',
        label: 'Describe a challenging distributed system or queue latency problem you solved.',
        type: 'textarea',
        value:
          'At Vync, we experienced queue worker contention during peak traffic spikes. I redesigned our BullMQ and Redis architecture with atomic partition keys and automated worker concurrency scaling, reducing p99 latency to 45ms and eliminating Redis memory hotspots.',
        required: true,
        isAiGenerated: true,
        reasoning: 'Synthesized directly from verified experience at Vync.',
        category: 'custom_question',
      },
      {
        fieldId: 'salary_expectation',
        label: 'What are your annual salary expectations (USD)?',
        type: 'text',
        value: '$150,000 - $165,000',
        required: false,
        isAiGenerated: true,
        reasoning: 'Aligned within candidate target range and job posted budget.',
        category: 'experience',
      },
    ],
    notes: 'Agent matched job at 94% score. Custom cover letter and application answers generated.',
    waitingForApproval: true,
    approvalRequestedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    historyLogs: [
      {
        status: 'MATCHED',
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
        note: 'AI Match Engine assigned 94% score (Strong Match).',
        source: 'agent',
      },
      {
        status: 'READY_TO_APPLY',
        timestamp: new Date(Date.now() - 3600000 * 3).toISOString(),
        note: 'Generated tailored cover letter and extracted application form requirements.',
        source: 'agent',
      },
      {
        status: 'WAITING_FOR_APPROVAL',
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
        note: 'Application package prepared and queued for human-in-the-loop review.',
        source: 'agent',
      },
    ],
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

// Seed sample email events
const initialEmails: EmailEvent[] = [];

// Seed telegram & email & scheduler configs
const defaultTelegramConfig: TelegramConfig = {
  enabled: true,
  botToken: '',
  chatId: '1276866292',
  notifyOnHighMatch: true,
  minMatchScore: 80,
  notifyOnApplicationReady: true,
  notifyOnSubmission: true,
  notifyOnInterview: true,
  notifyOnRejection: false,
  morningReportEnabled: true,
};

const defaultEmailDispatchConfig: EmailDispatchConfig = {
  enabled: true,
  recipientEmail: 'codepankaj84@gmail.com',
  senderName: 'Kinetic Autonomous AI',
  smtpHost: 'smtp.gmail.com',
  smtpPort: 587,
  smtpUser: '',
  smtpPassword: '',
  useTls: true,
  sendDailyMorningDigest: true,
};

const defaultSchedulerConfig: SchedulerConfig = {
  active: true,
  scheduleType: 'daily_morning',
  dailyMorningTime: '10:00',
  minJobsToApplyDaily: 5,
  autoSubmitOnMorning: true,
  intervalMinutes: 180,
  preferredTimes: ['10:00', '14:00', '18:00'],
  autoMatch: true,
  autoPrepareApplications: true,
  minMatchScoreForAutoPrepare: 80,
  autoCheckEmails: true,
  lastRunAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  nextRunAt: new Date(Date.now() + 3600000 * 1).toISOString(),
};

// Seed in-app notifications
const initialNotifications: NotificationMessage[] = [
  {
    id: 'notif_01',
    type: 'high_match',
    title: '🔥 High Job Match (95%)',
    body: 'Canonical is hiring Senior Software Engineer (Backend). Your Node.js, TypeScript & Redis skills are a direct match.',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    read: false,
    data: {
      jobId: 'job_seed_01',
      score: 95,
      company: 'Canonical',
    },
  },
  {
    id: 'notif_02',
    type: 'application_prepared',
    title: '📝 Application Prepared (Awaiting Approval)',
    body: 'Application for Canonical is prepared with tailored cover letter and custom questions answered. Ready for your review.',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    read: false,
    data: {
      applicationId: 'app_seed_01',
      company: 'Canonical',
    },
  },
  {
    id: 'notif_03',
    type: 'interview_detected',
    title: '🎉 Interview Invitation Detected!',
    body: 'Automattic sent an interview invitation for Senior Backend Engineer.',
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
    read: true,
    data: {
      applicationId: 'app_seed_02',
      company: 'Automattic',
    },
  },
];

// Persistent Multi-User File Store Engine
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

export const PRIMARY_USER: User = {
  id: 'usr_pankaj_default',
  name: 'Pankaj Kumar',
  email: 'codepankaj84@gmail.com',
  role: 'Senior Backend Software Engineer',
  isPrimary: true,
  createdAt: '2026-09-04T10:00:00.000Z',
};

export const DEMO_USER: User = {
  id: 'usr_demo_evaluator',
  name: 'Alex Reed',
  email: 'alex.reed@techcareer.io',
  role: 'Full Stack Engineer',
  isPrimary: false,
  createdAt: '2026-09-04T12:00:00.000Z',
};

export interface UserState {
  user: User;
  profile: CandidateProfile;
  telegramConfig: TelegramConfig;
  emailDispatchConfig: EmailDispatchConfig;
  schedulerConfig: SchedulerConfig;
  matches: JobMatch[];
  applications: PreparedApplication[];
  coverLetters: CoverLetter[];
  emails: EmailEvent[];
  notifications: NotificationMessage[];
  agentSessions: AgentRunSession[];
}

export interface MultiUserStoreSchema {
  version: '2.0';
  users: User[];
  userData: Record<string, UserState>;
  jobs: Job[];
}

// Clean isolated profile for fresh visitors / guests
const emptyGuestProfile: CandidateProfile = {
  id: 'profile_guest',
  name: 'Guest Candidate',
  email: '',
  phone: '',
  location: 'Remote',
  linkedinUrl: '',
  githubUrl: '',
  portfolioUrl: '',
  summary: 'Software Engineer exploring autonomous job matching and applications.',
  skills: ['TypeScript', 'JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git', 'REST APIs'],
  programmingLanguages: ['JavaScript', 'TypeScript', 'Python'],
  frameworks: ['React', 'Node.js', 'Express'],
  databases: ['PostgreSQL', 'MongoDB'],
  toolsAndCloud: ['Git', 'Docker', 'AWS'],
  preferredRoles: ['Software Engineer', 'Full Stack Developer', 'Backend Developer', 'Frontend Developer'],
  preferredLocations: ['Remote Worldwide', 'Remote'],
  remotePreference: 'remote',
  experience: [],
  education: [],
  projects: [],
  salaryPreference: {
    min: 90000,
    max: 160000,
    currency: 'USD',
  },
  jobTypes: ['Full-time', 'Contract'],
  keywords: ['Software Engineer', 'Full Stack', 'React', 'Node.js', 'TypeScript'],
  yearsOfExperience: 3,
  updatedAt: new Date().toISOString(),
};

class Database {
  private data: MultiUserStoreSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): MultiUserStoreSchema {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);

        // Check if file is already in v2.0 multi-user format
        if (parsed.version === '2.0' && parsed.userData && parsed.users) {
          return {
            version: '2.0',
            users: parsed.users,
            userData: parsed.userData,
            jobs: parsed.jobs || initialJobs,
          };
        }

        // Migrate legacy single-tenant format to v2.0 multi-user format
        const primaryUserData: UserState = {
          user: PRIMARY_USER,
          profile: parsed.profile || defaultProfile,
          telegramConfig: { ...defaultTelegramConfig, ...(parsed.telegramConfig || {}) },
          emailDispatchConfig: { ...defaultEmailDispatchConfig, ...(parsed.emailDispatchConfig || {}) },
          schedulerConfig: { ...defaultSchedulerConfig, ...(parsed.schedulerConfig || {}) },
          matches: parsed.matches || initialMatches,
          applications: parsed.applications || initialApplications,
          coverLetters: parsed.coverLetters || [],
          emails: parsed.emails || initialEmails,
          notifications: parsed.notifications || initialNotifications,
          agentSessions: parsed.agentSessions || [],
        };

        const migratedSchema: MultiUserStoreSchema = {
          version: '2.0',
          users: [PRIMARY_USER],
          userData: {
            [PRIMARY_USER.id]: primaryUserData,
          },
          jobs: parsed.jobs || initialJobs,
        };

        return migratedSchema;
      }
    } catch (err) {
      console.warn('Could not load data from file, using seeded defaults', err);
    }

    // Default seeded schema
    const initialUserData: UserState = {
      user: PRIMARY_USER,
      profile: defaultProfile,
      telegramConfig: defaultTelegramConfig,
      emailDispatchConfig: defaultEmailDispatchConfig,
      schedulerConfig: defaultSchedulerConfig,
      matches: initialMatches,
      applications: initialApplications,
      coverLetters: [],
      emails: initialEmails,
      notifications: initialNotifications,
      agentSessions: [],
    };

    return {
      version: '2.0',
      users: [PRIMARY_USER],
      userData: {
        [PRIMARY_USER.id]: initialUserData,
      },
      jobs: initialJobs,
    };
  }

  private persist() {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist database to file:', err);
    }
  }

  // Ensure user state exists and return it
  private getUserData(userId: string = 'usr_guest_default'): UserState {
    const effectiveUserId = userId || 'usr_guest_default';
    if (!this.data.userData[effectiveUserId]) {
      const isPrimary = effectiveUserId === PRIMARY_USER.id;
      const user = this.getUserById(effectiveUserId) || {
        id: effectiveUserId,
        name: isPrimary ? PRIMARY_USER.name : 'Guest Candidate',
        email: isPrimary ? PRIMARY_USER.email : '',
        role: isPrimary ? PRIMARY_USER.role : 'Software Engineer',
        isPrimary: isPrimary,
        createdAt: new Date().toISOString(),
      };

      const newUserProfile: CandidateProfile = isPrimary
        ? { ...defaultProfile }
        : {
            ...emptyGuestProfile,
            id: `profile_${effectiveUserId}`,
            name: user.name && user.name !== 'Guest Candidate' ? user.name : 'Guest Candidate',
            email: user.email || '',
            updatedAt: new Date().toISOString(),
          };

      this.data.userData[effectiveUserId] = {
        user,
        profile: newUserProfile,
        telegramConfig: isPrimary
          ? defaultTelegramConfig
          : {
              enabled: false,
              botToken: '',
              chatId: '',
              notifyOnHighMatch: true,
              minMatchScore: 80,
              notifyOnApplicationReady: true,
              notifyOnSubmission: true,
              notifyOnInterview: true,
              notifyOnRejection: false,
              morningReportEnabled: true,
            },
        emailDispatchConfig: isPrimary
          ? defaultEmailDispatchConfig
          : {
              enabled: false,
              recipientEmail: user.email || '',
              senderName: user.name || 'Kinetic Candidate',
              smtpHost: 'smtp.gmail.com',
              smtpPort: 587,
              smtpUser: '',
              smtpPassword: '',
              useTls: true,
              sendDailyMorningDigest: false,
            },
        schedulerConfig: {
          ...defaultSchedulerConfig,
        },
        matches: isPrimary ? initialMatches : [],
        applications: isPrimary ? initialApplications : [],
        coverLetters: [],
        emails: [],
        notifications: [
          {
            id: `notif_${Date.now()}`,
            type: 'system_alert',
            title: '👋 Welcome to Kinetic Autonomous Career OS',
            body: 'Your fresh isolated workspace is active. Add your profile or upload a resume to begin autonomous matching.',
            timestamp: new Date().toISOString(),
            read: false,
          },
        ],
        agentSessions: [],
      };

      if (!this.data.users.some((u) => u.id === effectiveUserId)) {
        this.data.users.push(user);
      }
      this.persist();
    }
    return this.data.userData[effectiveUserId];
  }

  // User Management
  getUsers(): User[] {
    return this.data.users;
  }

  getUserById(id: string): User | undefined {
    return this.data.users.find((u) => u.id === id);
  }

  getUserByEmail(email: string): User | undefined {
    const norm = email.trim().toLowerCase();
    return this.data.users.find((u) => u.email.trim().toLowerCase() === norm);
  }

  createUser(name: string, email: string, role?: string): { user: User; token: string } {
    const existing = this.getUserByEmail(email);
    if (existing) {
      return { user: existing, token: `token_${existing.id}` };
    }

    const newUser: User = {
      id: `usr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`,
      name: name.trim() || 'Candidate',
      email: email.trim().toLowerCase(),
      role: role?.trim() || 'Software Engineer',
      isPrimary: false,
      createdAt: new Date().toISOString(),
    };

    this.data.users.push(newUser);
    // Initialize user state
    this.getUserData(newUser.id);
    this.persist();

    return { user: newUser, token: `token_${newUser.id}` };
  }

  getDemoUser(): { user: User; token: string } {
    let demo = this.getUserById(DEMO_USER.id);
    if (!demo) {
      this.data.users.push(DEMO_USER);
      this.getUserData(DEMO_USER.id);
      this.persist();
      demo = DEMO_USER;
    }
    return { user: demo, token: `token_${demo.id}` };
  }

  getPrimaryUser(): { user: User; token: string } {
    return { user: PRIMARY_USER, token: `token_${PRIMARY_USER.id}` };
  }

  // Profile operations
  getProfile(userId: string = PRIMARY_USER.id): CandidateProfile {
    return this.getUserData(userId).profile;
  }

  updateProfile(profile: Partial<CandidateProfile>, userId: string = PRIMARY_USER.id): CandidateProfile {
    const userData = this.getUserData(userId);
    userData.profile = {
      ...userData.profile,
      ...profile,
      updatedAt: new Date().toISOString(),
    };
    // Also sync user name/email if changed
    if (profile.name) userData.user.name = profile.name;
    if (profile.email) userData.user.email = profile.email;
    if (profile.preferredRoles?.[0]) userData.user.role = profile.preferredRoles[0];

    this.persist();
    return userData.profile;
  }

  // Jobs operations (shared global job listings pool)
  getJobs(): Job[] {
    return this.data.jobs;
  }

  getJobById(id: string): Job | undefined {
    return this.data.jobs.find((j) => j.id === id);
  }

  addJobs(newJobs: Job[]): { added: number; deduplicated: number } {
    let added = 0;
    let deduplicated = 0;

    for (const job of newJobs) {
      const normCompany = job.company.toLowerCase().trim();
      const normTitle = job.title.toLowerCase().replace(/[^a-z0-9]/g, '');
      const normLoc = job.location.toLowerCase().trim();

      const exists = this.data.jobs.some(
        (existing) =>
          (existing.source === job.source && existing.externalId === job.externalId) ||
          (existing.company.toLowerCase().trim() === normCompany &&
            existing.title.toLowerCase().replace(/[^a-z0-9]/g, '') === normTitle &&
            (existing.location.toLowerCase().trim() === normLoc || (existing.remote && job.remote)))
      );

      if (exists) {
        deduplicated++;
      } else {
        this.data.jobs.unshift(job);
        added++;
      }
    }

    if (added > 0) {
      this.persist();
    }
    return { added, deduplicated };
  }

  // Match operations (user-scoped)
  getMatches(userId: string = PRIMARY_USER.id): JobMatch[] {
    return this.getUserData(userId).matches;
  }

  getMatchByJobId(jobId: string, userId: string = PRIMARY_USER.id): JobMatch | undefined {
    return this.getUserData(userId).matches.find((m) => m.jobId === jobId);
  }

  saveMatch(match: JobMatch, userId: string = PRIMARY_USER.id): JobMatch {
    const userData = this.getUserData(userId);
    const idx = userData.matches.findIndex((m) => m.jobId === match.jobId);
    if (idx >= 0) {
      userData.matches[idx] = match;
    } else {
      userData.matches.push(match);
    }
    this.persist();
    return match;
  }

  // Application operations (user-scoped)
  getApplications(userId: string = PRIMARY_USER.id): PreparedApplication[] {
    return this.getUserData(userId).applications;
  }

  getApplicationById(id: string, userId: string = PRIMARY_USER.id): PreparedApplication | undefined {
    return this.getUserData(userId).applications.find((a) => a.id === id);
  }

  getApplicationByJobId(jobId: string, userId: string = PRIMARY_USER.id): PreparedApplication | undefined {
    return this.getUserData(userId).applications.find((a) => a.id === jobId || a.jobId === jobId);
  }

  saveApplication(app: PreparedApplication, userId: string = PRIMARY_USER.id): PreparedApplication {
    const userData = this.getUserData(userId);
    const idx = userData.applications.findIndex((a) => a.id === app.id);
    if (idx >= 0) {
      userData.applications[idx] = app;
    } else {
      userData.applications.unshift(app);
    }
    this.persist();
    return app;
  }

  deleteApplication(id: string, userId: string = PRIMARY_USER.id): boolean {
    const userData = this.getUserData(userId);
    const initialLen = userData.applications.length;
    userData.applications = userData.applications.filter((a) => a.id !== id);
    if (userData.applications.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // Cover letter operations (user-scoped)
  getCoverLetters(userId: string = PRIMARY_USER.id): CoverLetter[] {
    return this.getUserData(userId).coverLetters;
  }

  saveCoverLetter(letter: CoverLetter, userId: string = PRIMARY_USER.id): CoverLetter {
    const userData = this.getUserData(userId);
    const idx = userData.coverLetters.findIndex((c) => c.id === letter.id);
    if (idx >= 0) {
      userData.coverLetters[idx] = letter;
    } else {
      userData.coverLetters.unshift(letter);
    }
    this.persist();
    return letter;
  }

  // Email operations (user-scoped)
  getEmails(userId: string = PRIMARY_USER.id): EmailEvent[] {
    return this.getUserData(userId).emails;
  }

  addEmail(email: EmailEvent, userId: string = PRIMARY_USER.id): EmailEvent {
    const userData = this.getUserData(userId);
    userData.emails.unshift(email);
    this.persist();
    return email;
  }

  updateEmail(id: string, updates: Partial<EmailEvent>, userId: string = PRIMARY_USER.id): EmailEvent | undefined {
    const userData = this.getUserData(userId);
    const email = userData.emails.find((e) => e.id === id);
    if (email) {
      Object.assign(email, updates);
      this.persist();
      return email;
    }
    return undefined;
  }

  // Notifications (user-scoped)
  getNotifications(userId: string = PRIMARY_USER.id): NotificationMessage[] {
    return this.getUserData(userId).notifications;
  }

  addNotification(notif: NotificationMessage, userId: string = PRIMARY_USER.id): NotificationMessage {
    const userData = this.getUserData(userId);
    userData.notifications.unshift(notif);
    this.persist();
    return notif;
  }

  markNotificationRead(id: string, userId: string = PRIMARY_USER.id): void {
    const userData = this.getUserData(userId);
    const notif = userData.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      this.persist();
    }
  }

  clearNotifications(userId: string = PRIMARY_USER.id): void {
    const userData = this.getUserData(userId);
    userData.notifications = [];
    this.persist();
  }

  // Configs (user-scoped)
  getTelegramConfig(userId: string = PRIMARY_USER.id): TelegramConfig {
    return this.getUserData(userId).telegramConfig;
  }

  updateTelegramConfig(config: Partial<TelegramConfig>, userId: string = PRIMARY_USER.id): TelegramConfig {
    const userData = this.getUserData(userId);
    userData.telegramConfig = {
      ...userData.telegramConfig,
      ...config,
    };
    this.persist();
    return userData.telegramConfig;
  }

  getEmailDispatchConfig(userId: string = PRIMARY_USER.id): EmailDispatchConfig {
    return this.getUserData(userId).emailDispatchConfig || defaultEmailDispatchConfig;
  }

  updateEmailDispatchConfig(config: Partial<EmailDispatchConfig>, userId: string = PRIMARY_USER.id): EmailDispatchConfig {
    const userData = this.getUserData(userId);
    userData.emailDispatchConfig = {
      ...(userData.emailDispatchConfig || defaultEmailDispatchConfig),
      ...config,
    };
    this.persist();
    return userData.emailDispatchConfig;
  }

  getSchedulerConfig(userId: string = PRIMARY_USER.id): SchedulerConfig {
    return this.getUserData(userId).schedulerConfig;
  }

  updateSchedulerConfig(config: Partial<SchedulerConfig>, userId: string = PRIMARY_USER.id): SchedulerConfig {
    const userData = this.getUserData(userId);
    userData.schedulerConfig = {
      ...userData.schedulerConfig,
      ...config,
    };
    this.persist();
    return userData.schedulerConfig;
  }

  // Agent sessions (user-scoped)
  getAgentSessions(userId: string = PRIMARY_USER.id): AgentRunSession[] {
    return this.getUserData(userId).agentSessions;
  }

  saveAgentSession(session: AgentRunSession, userId: string = PRIMARY_USER.id): AgentRunSession {
    const userData = this.getUserData(userId);
    const idx = userData.agentSessions.findIndex((s) => s.id === session.id);
    if (idx >= 0) {
      userData.agentSessions[idx] = session;
    } else {
      userData.agentSessions.unshift(session);
    }
    this.persist();
    return session;
  }

  // Stats calculation (user-scoped)
  getDashboardStats(userId: string = PRIMARY_USER.id): DashboardStats {
    const userData = this.getUserData(userId);
    const totalJobs = this.data.jobs.length;
    const matches = userData.matches;
    const apps = userData.applications;

    const strongMatches = matches.filter((m) => m.score >= 80).length;
    const waitingApproval = apps.filter((a) => a.status === 'WAITING_FOR_APPROVAL').length;
    const applied = apps.filter((a) => a.status === 'APPLIED').length;
    const screening = apps.filter((a) => a.status === 'SCREENING').length;
    const interview = apps.filter((a) => a.status === 'INTERVIEW').length;
    const offers = apps.filter((a) => a.status === 'OFFER').length;
    const rejected = apps.filter((a) => a.status === 'REJECTED').length;

    const totalScore = matches.reduce((acc, m) => acc + m.score, 0);
    const avgScore = matches.length > 0 ? Math.round(totalScore / matches.length) : 0;

    const recentActivity = [
      ...apps.map((a) => ({
        id: `act_app_${a.id}`,
        type: 'Application',
        message: `${a.company} - ${a.jobTitle} (${a.status.replace(/_/g, ' ')})`,
        time: a.updatedAt,
        badgeColor: a.status === 'INTERVIEW' ? 'purple' : a.status === 'OFFER' ? 'green' : 'blue',
      })),
      ...userData.notifications.slice(0, 5).map((n) => ({
        id: `act_notif_${n.id}`,
        type: 'Alert',
        message: n.title + ': ' + n.body.slice(0, 70) + (n.body.length > 70 ? '...' : ''),
        time: n.timestamp,
        badgeColor: 'amber',
      })),
    ]
      .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
      .slice(0, 10);

    return {
      totalJobsScanned: totalJobs,
      newMatchesCount: matches.length,
      strongMatchesCount: strongMatches,
      totalApplications: apps.length,
      waitingApprovalCount: waitingApproval,
      appliedCount: applied,
      screeningCount: screening,
      interviewCount: interview,
      offersCount: offers,
      rejectedCount: rejected,
      averageMatchScore: avgScore,
      recentActivity,
    };
  }

  // Reset demo data helper
  resetToDefaults(userId: string = PRIMARY_USER.id) {
    const userData = this.getUserData(userId);
    userData.profile = defaultProfile;
    userData.matches = initialMatches;
    userData.applications = initialApplications;
    userData.coverLetters = [];
    userData.emails = initialEmails;
    userData.telegramConfig = defaultTelegramConfig;
    userData.emailDispatchConfig = defaultEmailDispatchConfig;
    userData.schedulerConfig = defaultSchedulerConfig;
    userData.notifications = initialNotifications;
    userData.agentSessions = [];
    this.persist();
  }
}

export const db = new Database();

