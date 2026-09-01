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
} from '../src/types';
import fs from 'fs';
import path from 'path';

// Initial default candidate profile
const defaultProfile: CandidateProfile = {
  id: 'profile_default_01',
  name: 'Alex Morgan',
  email: 'alex.morgan.dev@example.com',
  phone: '+1 (555) 234-5678',
  location: 'San Francisco, CA (Open to Remote)',
  linkedinUrl: 'https://linkedin.com/in/alexmorgandev',
  githubUrl: 'https://github.com/alexmorgandev',
  portfolioUrl: 'https://alexmorgan.dev',
  summary:
    'Full Stack Software Engineer with 4+ years of experience building resilient microservices, high-throughput REST/GraphQL APIs, and dynamic React frontends. Proficient in TypeScript, Node.js, Express, PostgreSQL, MongoDB, and AWS cloud architectures. Passionate about AI agents, distributed systems, and developer ergonomics.',
  skills: [
    'TypeScript',
    'Node.js',
    'Express',
    'React',
    'Next.js',
    'PostgreSQL',
    'MongoDB',
    'Redis',
    'Docker',
    'AWS (S3, EC2, Lambda)',
    'REST APIs',
    'GraphQL',
    'Tailwind CSS',
    'Jest',
    'CI/CD Pipelines',
    'Git',
  ],
  programmingLanguages: ['TypeScript', 'JavaScript', 'Python', 'SQL'],
  frameworks: ['React', 'Express.js', 'Next.js', 'NestJS', 'TailwindCSS'],
  databases: ['PostgreSQL', 'MongoDB', 'Redis'],
  toolsAndCloud: ['AWS', 'Docker', 'Git', 'GitHub Actions', 'BullMQ', 'Linux'],
  preferredRoles: [
    'Senior Backend Engineer',
    'Full Stack Engineer',
    'Node.js Developer',
    'Software Engineer II',
    'AI Engineer',
  ],
  preferredLocations: ['Remote', 'San Francisco, CA', 'New York, NY', 'Seattle, WA'],
  remotePreference: 'remote',
  experience: [
    {
      id: 'exp_1',
      company: 'AetherFlow Systems',
      role: 'Full Stack Engineer',
      startDate: '2023-01',
      endDate: 'Present',
      current: true,
      description:
        'Architected high-scale backend microservices in Node.js and TypeScript handling over 15M daily requests with 99.98% uptime.',
      highlights: [
        'Designed asynchronous job processing pipeline using BullMQ and Redis, reducing task latency by 45%',
        'Built modern React internal dashboard with real-time WebSocket telemetry for infrastructure monitoring',
        'Implemented OAuth 2.0 authentication and automated CI/CD workflows using GitHub Actions and Docker',
      ],
    },
    {
      id: 'exp_2',
      company: 'NovuByte Technologies',
      role: 'Software Engineer',
      startDate: '2021-06',
      endDate: '2022-12',
      current: false,
      description:
        'Developed customer-facing REST APIs and responsive web interfaces using Node.js, PostgreSQL, and React.',
      highlights: [
        'Optimized complex PostgreSQL database queries reducing API response times from 420ms to 85ms',
        'Integrated third-party payment gateways (Stripe) and automated webhook handling with idempotency',
      ],
    },
  ],
  education: [
    {
      id: 'edu_1',
      institution: 'University of California, Davis',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      graduationYear: '2021',
    },
  ],
  projects: [
    {
      id: 'proj_1',
      title: 'Agentic Workflow Orchestrator',
      description:
        'Open-source distributed task runner leveraging LLM function calling and Redis queues to automate developer workflows.',
      technologies: ['TypeScript', 'Node.js', 'Redis', 'BullMQ', 'Gemini API'],
      link: 'https://github.com/alexmorgandev/agentic-orchestrator',
    },
    {
      id: 'proj_2',
      title: 'CloudPulse Analytics Engine',
      description:
        'Real-time metrics aggregator streaming events into TimescaleDB with dynamic React charting dashboards.',
      technologies: ['React', 'Node.js', 'PostgreSQL', 'Docker'],
      link: 'https://github.com/alexmorgandev/cloudpulse',
    },
  ],
  salaryPreference: {
    min: 130000,
    max: 180000,
    currency: 'USD',
  },
  jobTypes: ['Full-time', 'Contract'],
  excludedCompanies: ['BadCompany Inc', 'CryptoSpam Labs'],
  keywords: ['TypeScript', 'Node.js', 'Backend', 'Full Stack', 'Cloud', 'Distributed Systems'],
  yearsOfExperience: 4.5,
  updatedAt: new Date().toISOString(),
};

// Seed realistic job listings
const initialJobs: Job[] = [
  {
    id: 'job_seed_01',
    externalId: 'gh_40921',
    source: 'Greenhouse',
    title: 'Senior Backend Engineer (Node.js & Distributed Systems)',
    company: 'StripeStack Technologies',
    location: 'San Francisco, CA (Remote)',
    remote: true,
    jobType: 'Full-time',
    description: `We are looking for a Senior Backend Engineer to join our Platform Core team. You will design, build, and maintain mission-critical microservices and event pipelines powering thousands of business clients.

Key Responsibilities:
- Build reliable, low-latency REST and GraphQL APIs using Node.js and TypeScript.
- Architect asynchronous event queues using Redis, BullMQ, and PostgreSQL.
- Partner with infrastructure teams to deploy scalable containers on AWS/Docker.
- Write clean, well-tested code with rigorous automated unit and integration suites.

Requirements:
- 3+ years experience with modern Node.js, TypeScript, and Express/NestJS.
- Solid understanding of relational databases (PostgreSQL) and caching layers (Redis).
- Familiarity with CI/CD, Docker, and cloud deployments (AWS or GCP).
- Strong problem-solving mindset and dedication to clean architecture.`,
    url: 'https://boards.greenhouse.io/stripestack/jobs/40921',
    salary: {
      min: 145000,
      max: 175000,
      currency: 'USD',
      period: 'year',
    },
    experienceRequiredYears: 3,
    skillsRequired: ['TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'Docker', 'AWS', 'REST APIs'],
    postedAt: new Date(Date.now() - 3600000 * 6).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 6).toISOString(),
  },
  {
    id: 'job_seed_02',
    externalId: 'lev_88301',
    source: 'Lever',
    title: 'Full Stack Engineer (React, Node.js, AI Workflows)',
    company: 'NexusAI Labs',
    location: 'New York, NY (Remote US/Canada)',
    remote: true,
    jobType: 'Full-time',
    description: `NexusAI is building the next generation of intelligent workflow automation tools. We are seeking a Full Stack Engineer passionate about developer tooling and LLM-powered applications.

What You Will Do:
- Develop intuitive user interfaces in React, Tailwind CSS, and Vite.
- Build server-side orchestration pipelines in Node.js and Express connecting to Gemini / AI models.
- Manage persistent state with MongoDB and PostgreSQL.
- Maintain high security, fast performance, and smooth animations.

Qualifications:
- 3+ years experience in Full Stack development with React and Node.js/TypeScript.
- Experience with AI SDKs, LLM prompting, or tool-calling agent systems is a big plus!
- Experience with Tailwind CSS and responsive web UI.
- Strong team communication and autonomy in a remote environment.`,
    url: 'https://jobs.lever.co/nexusai/88301',
    salary: {
      min: 140000,
      max: 180000,
      currency: 'USD',
      period: 'year',
    },
    experienceRequiredYears: 3,
    skillsRequired: ['React', 'TypeScript', 'Node.js', 'Express', 'Tailwind CSS', 'AI / Gemini', 'MongoDB'],
    postedAt: new Date(Date.now() - 3600000 * 18).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 18).toISOString(),
  },
  {
    id: 'job_seed_03',
    externalId: 'rok_9921',
    source: 'RemoteOK',
    title: 'Backend API Developer (TypeScript / PostgreSQL)',
    company: 'CloudScale Global',
    location: 'Worldwide (Remote)',
    remote: true,
    jobType: 'Full-time',
    description: `Join CloudScale Global to engineer data ingestion pipelines and developer API services.

Requirements:
- Strong command of TypeScript, Express/Node.js, PostgreSQL, and Redis.
- Proven track record designing high-throughput REST APIs.
- Experience with containerization (Docker) and AWS or GCP.
- Self-starter who thrives in an asynchronous, remote-first culture.`,
    url: 'https://remoteok.com/remote-jobs/9921-backend-developer',
    salary: {
      min: 135000,
      max: 165000,
      currency: 'USD',
      period: 'year',
    },
    experienceRequiredYears: 3,
    skillsRequired: ['TypeScript', 'Node.js', 'PostgreSQL', 'Redis', 'REST APIs', 'Docker'],
    postedAt: new Date(Date.now() - 3600000 * 28).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 28).toISOString(),
  },
  {
    id: 'job_seed_04',
    externalId: 'gh_55410',
    source: 'Greenhouse',
    title: 'Senior Python & C++ Quant Platform Engineer',
    company: 'Apex Trading Capital',
    location: 'Chicago, IL (Onsite)',
    remote: false,
    jobType: 'Full-time',
    description: `Apex Trading Capital is seeking a low-latency C++ & Python Quant Engineer. Must have 8+ years experience in high frequency trading infrastructure, FPGA programming, and Linux kernel bypass networking.`,
    url: 'https://boards.greenhouse.io/apextrading/55410',
    salary: {
      min: 220000,
      max: 300000,
      currency: 'USD',
      period: 'year',
    },
    experienceRequiredYears: 8,
    skillsRequired: ['C++', 'Python', 'FPGA', 'Linux Kernel', 'Low Latency Networking'],
    postedAt: new Date(Date.now() - 3600000 * 40).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 40).toISOString(),
  },
  {
    id: 'job_seed_05',
    externalId: 'lev_44120',
    source: 'Lever',
    title: 'Senior Software Engineer - Infrastructure & Microservices',
    company: 'Datacore Cloud',
    location: 'Remote (US/Canada)',
    remote: true,
    jobType: 'Full-time',
    description: `Datacore Cloud is scaling its global edge database infrastructure. We need an experienced backend engineer to lead our microservices architecture and Redis cache federation.

Responsibilities:
- Build and scale Node.js & Go microservices.
- Optimize multi-region data replication across PostgreSQL clusters.
- Enhance CI/CD pipelines and infrastructure as code.`,
    url: 'https://jobs.lever.co/datacore/44120',
    salary: {
      min: 150000,
      max: 185000,
      currency: 'USD',
      period: 'year',
    },
    experienceRequiredYears: 4,
    skillsRequired: ['Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Docker', 'AWS', 'Microservices'],
    postedAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
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
    jobTitle: 'Senior Backend Engineer (Node.js & Distributed Systems)',
    company: 'StripeStack Technologies',
    applicationUrl: 'https://boards.greenhouse.io/stripestack/jobs/40921',
    status: 'WAITING_FOR_APPROVAL',
    matchScore: 94,
    resumeVersion: 'Alex_Morgan_Backend_Resume_v4.pdf',
    coverLetterId: 'cl_seed_01',
    coverLetterContent: `Dear StripeStack Technologies Hiring Team,

I am writing to express my strong enthusiasm for the Senior Backend Engineer position. With 4+ years of hands-on experience building high-throughput TypeScript and Node.js microservices handling over 15M daily requests at AetherFlow Systems, I am confident in my ability to immediately accelerate your Platform Core initiatives.

In my recent work, I architected an asynchronous task processing engine using BullMQ and Redis that slashed event latency by 45% while maintaining strict data integrity across our PostgreSQL clusters. My background in building resilient RESTful APIs, implementing robust OAuth 2.0 authorization, and deploying containerized services with Docker directly matches StripeStack's technical demands.

I admire StripeStack's commitment to developer-first platform infrastructure and would love the opportunity to contribute to your scalable core systems. Thank you for your time and consideration.

Warm regards,
Alex Morgan`,
    formFields: [
      {
        fieldId: 'first_name',
        label: 'First Name',
        type: 'text',
        value: 'Alex',
        required: true,
        isAiGenerated: false,
        category: 'personal',
      },
      {
        fieldId: 'last_name',
        label: 'Last Name',
        type: 'text',
        value: 'Morgan',
        required: true,
        isAiGenerated: false,
        category: 'personal',
      },
      {
        fieldId: 'email',
        label: 'Email Address',
        type: 'text',
        value: 'alex.morgan.dev@example.com',
        required: true,
        isAiGenerated: false,
        category: 'personal',
      },
      {
        fieldId: 'phone',
        label: 'Phone Number',
        type: 'text',
        value: '+1 (555) 234-5678',
        required: true,
        isAiGenerated: false,
        category: 'personal',
      },
      {
        fieldId: 'linkedin',
        label: 'LinkedIn Profile',
        type: 'text',
        value: 'https://linkedin.com/in/alexmorgandev',
        required: false,
        isAiGenerated: false,
        category: 'personal',
      },
      {
        fieldId: 'github',
        label: 'GitHub / Portfolio',
        type: 'text',
        value: 'https://github.com/alexmorgandev',
        required: false,
        isAiGenerated: false,
        category: 'personal',
      },
      {
        fieldId: 'work_auth',
        label: 'Are you legally authorized to work in the US without sponsorship?',
        type: 'select',
        value: 'Yes',
        required: true,
        isAiGenerated: true,
        reasoning: 'Verified from candidate profile US residency status.',
        category: 'legal',
      },
      {
        fieldId: 'q_distributed_systems',
        label: 'Describe a challenging distributed system or queue latency problem you solved.',
        type: 'textarea',
        value:
          'At AetherFlow Systems, we experienced queue worker contention during peak traffic spikes. I redesigned our BullMQ and Redis architecture with atomic partition keys and automated worker concurrency scaling, reducing tail latency by 45% and eliminating Redis memory hotspots.',
        required: true,
        isAiGenerated: true,
        reasoning: 'Synthesized directly from verified experience at AetherFlow Systems.',
        category: 'custom_question',
      },
      {
        fieldId: 'salary_expectation',
        label: 'What are your annual salary expectations (USD)?',
        type: 'text',
        value: '$150,000 - $165,000',
        required: false,
        isAiGenerated: true,
        reasoning: 'Aligned within candidate target range ($130k-$180k) and job posted budget ($145k-$175k).',
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
  {
    id: 'app_seed_02',
    jobId: 'job_seed_05',
    candidateProfileId: 'profile_default_01',
    jobTitle: 'Senior Software Engineer - Infrastructure & Microservices',
    company: 'Datacore Cloud',
    applicationUrl: 'https://jobs.lever.co/datacore/44120',
    status: 'INTERVIEW',
    matchScore: 92,
    resumeVersion: 'Alex_Morgan_Backend_Resume_v4.pdf',
    notes: 'Technical screening passed. System Design interview scheduled for next Tuesday at 2:00 PM PST.',
    waitingForApproval: false,
    approvedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    appliedAt: new Date(Date.now() - 86400000 * 4).toISOString(),
    interviewDate: new Date(Date.now() + 86400000 * 3).toISOString(),
    formFields: [],
    historyLogs: [
      {
        status: 'APPLIED',
        timestamp: new Date(Date.now() - 86400000 * 4).toISOString(),
        note: 'User approved and agent completed automated submission.',
        source: 'user',
      },
      {
        status: 'SCREENING',
        timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
        note: 'Recruiter review email detected via Email Monitor.',
        source: 'email_monitor',
      },
      {
        status: 'INTERVIEW',
        timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
        note: 'AI classified recruiter invitation: System Design Interview on calendar.',
        source: 'email_monitor',
      },
    ],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    updatedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
];

// Seed sample email events
const initialEmails: EmailEvent[] = [
  {
    id: 'em_01',
    sender: 'recruiting@datacorecloud.com',
    recipient: 'alex.morgan.dev@example.com',
    subject: 'Interview Invitation: Senior Software Engineer at Datacore Cloud',
    snippet: 'Hi Alex, we reviewed your application and would love to invite you to a 45-minute technical conversation...',
    fullBody: `Hi Alex,

Thank you for applying to the Senior Software Engineer (Infrastructure) position at Datacore Cloud!

Our engineering leadership was very impressed with your background in Node.js microservices and Redis queuing architectures. We would love to invite you to a 45-minute technical system design conversation with our Lead Architect next week.

Please choose a slot that works best for you on our scheduling link: https://calendly.com/datacore-recruiting/alex-morgan

Best regards,
Sarah Jenkins
Technical Talent Partner | Datacore Cloud`,
    receivedAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    classification: 'INTERVIEW',
    confidenceScore: 0.98,
    detectedCompany: 'Datacore Cloud',
    matchedApplicationId: 'app_seed_02',
    processed: true,
    actionTaken: 'Updated Datacore Cloud application status to INTERVIEW and dispatched Telegram alert.',
  },
  {
    id: 'em_02',
    sender: 'careers@hypergrowthfin.io',
    recipient: 'alex.morgan.dev@example.com',
    subject: 'Update regarding your application for Backend Lead',
    snippet: 'Thank you for your interest in HyperGrowth. Unfortunately we have decided to move forward with another candidate...',
    fullBody: `Dear Alex,

Thank you for taking the time to apply for the Backend Lead position at HyperGrowth Financial. While your credentials are impressive, we have decided to proceed with candidates whose background more closely aligns with our specific Go/Rust tech stack.

We wish you all the best in your job search and career endeavors.

Sincerely,
HyperGrowth Talent Acquisition`,
    receivedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    classification: 'REJECTION',
    confidenceScore: 0.96,
    detectedCompany: 'HyperGrowth Financial',
    processed: true,
    actionTaken: 'Logged status update; no active application conflict.',
  },
];

// Seed telegram & email & scheduler configs
const defaultTelegramConfig: TelegramConfig = {
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
};

const defaultEmailDispatchConfig: EmailDispatchConfig = {
  enabled: true,
  recipientEmail: 'codepankaj84@gmail.com',
  senderName: 'JobAgent Autonomous AI',
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
    title: '🔥 High Job Match (94%)',
    body: 'StripeStack Technologies is hiring Senior Backend Engineer. Your Node.js & Redis skills are a direct match.',
    timestamp: new Date(Date.now() - 3600000 * 5).toISOString(),
    read: false,
    data: {
      jobId: 'job_seed_01',
      score: 94,
      company: 'StripeStack Technologies',
    },
  },
  {
    id: 'notif_02',
    type: 'application_prepared',
    title: '📝 Application Prepared (Awaiting Approval)',
    body: 'Application for StripeStack Technologies is prepared with tailored cover letter and custom questions answered. Ready for your review.',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    read: false,
    data: {
      applicationId: 'app_seed_01',
      company: 'StripeStack Technologies',
    },
  },
  {
    id: 'notif_03',
    type: 'interview_detected',
    title: '🎉 Interview Invitation Detected!',
    body: 'Datacore Cloud sent an interview invitation for Senior Software Engineer.',
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
    read: true,
    data: {
      applicationId: 'app_seed_02',
      company: 'Datacore Cloud',
    },
  },
];

// Persistent File Store Engine
const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'store.json');

interface StoreSchema {
  profile: CandidateProfile;
  jobs: Job[];
  matches: JobMatch[];
  applications: PreparedApplication[];
  coverLetters: CoverLetter[];
  emails: EmailEvent[];
  telegramConfig: TelegramConfig;
  emailDispatchConfig: EmailDispatchConfig;
  schedulerConfig: SchedulerConfig;
  notifications: NotificationMessage[];
  agentSessions: AgentRunSession[];
}

class Database {
  private data: StoreSchema;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): StoreSchema {
    try {
      if (fs.existsSync(DATA_FILE)) {
        const raw = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        return {
          profile: parsed.profile || defaultProfile,
          jobs: parsed.jobs || initialJobs,
          matches: parsed.matches || initialMatches,
          applications: parsed.applications || initialApplications,
          coverLetters: parsed.coverLetters || [],
          emails: parsed.emails || initialEmails,
          telegramConfig: { ...defaultTelegramConfig, ...(parsed.telegramConfig || {}) },
          emailDispatchConfig: { ...defaultEmailDispatchConfig, ...(parsed.emailDispatchConfig || {}) },
          schedulerConfig: { ...defaultSchedulerConfig, ...(parsed.schedulerConfig || {}) },
          notifications: parsed.notifications || initialNotifications,
          agentSessions: parsed.agentSessions || [],
        };
      }
    } catch (err) {
      console.warn('Could not load data from file, using seeded defaults', err);
    }
    return {
      profile: defaultProfile,
      jobs: initialJobs,
      matches: initialMatches,
      applications: initialApplications,
      coverLetters: [],
      emails: initialEmails,
      telegramConfig: defaultTelegramConfig,
      emailDispatchConfig: defaultEmailDispatchConfig,
      schedulerConfig: defaultSchedulerConfig,
      notifications: initialNotifications,
      agentSessions: [],
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

  // Profile operations
  getProfile(): CandidateProfile {
    return this.data.profile;
  }

  updateProfile(profile: Partial<CandidateProfile>): CandidateProfile {
    this.data.profile = {
      ...this.data.profile,
      ...profile,
      updatedAt: new Date().toISOString(),
    };
    this.persist();
    return this.data.profile;
  }

  // Jobs operations
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
      // Deduplication rules (Section 8 of specification):
      // 1. Match source + externalId
      // 2. Fallback: normalized company + normalized title + normalized location
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

  // Match operations
  getMatches(): JobMatch[] {
    return this.data.matches;
  }

  getMatchByJobId(jobId: string): JobMatch | undefined {
    return this.data.matches.find((m) => m.jobId === jobId);
  }

  saveMatch(match: JobMatch): JobMatch {
    const idx = this.data.matches.findIndex((m) => m.jobId === match.jobId);
    if (idx >= 0) {
      this.data.matches[idx] = match;
    } else {
      this.data.matches.push(match);
    }
    this.persist();
    return match;
  }

  // Application operations
  getApplications(): PreparedApplication[] {
    return this.data.applications;
  }

  getApplicationById(id: string): PreparedApplication | undefined {
    return this.data.applications.find((a) => a.id === id);
  }

  getApplicationByJobId(jobId: string): PreparedApplication | undefined {
    return this.data.applications.find((a) => a.id === jobId || a.jobId === jobId);
  }

  saveApplication(app: PreparedApplication): PreparedApplication {
    const idx = this.data.applications.findIndex((a) => a.id === app.id);
    if (idx >= 0) {
      this.data.applications[idx] = app;
    } else {
      this.data.applications.unshift(app);
    }
    this.persist();
    return app;
  }

  deleteApplication(id: string): boolean {
    const initialLen = this.data.applications.length;
    this.data.applications = this.data.applications.filter((a) => a.id !== id);
    if (this.data.applications.length !== initialLen) {
      this.persist();
      return true;
    }
    return false;
  }

  // Cover letter operations
  getCoverLetters(): CoverLetter[] {
    return this.data.coverLetters;
  }

  saveCoverLetter(letter: CoverLetter): CoverLetter {
    const idx = this.data.coverLetters.findIndex((c) => c.id === letter.id);
    if (idx >= 0) {
      this.data.coverLetters[idx] = letter;
    } else {
      this.data.coverLetters.unshift(letter);
    }
    this.persist();
    return letter;
  }

  // Email operations
  getEmails(): EmailEvent[] {
    return this.data.emails;
  }

  addEmail(email: EmailEvent): EmailEvent {
    this.data.emails.unshift(email);
    this.persist();
    return email;
  }

  updateEmail(id: string, updates: Partial<EmailEvent>): EmailEvent | undefined {
    const email = this.data.emails.find((e) => e.id === id);
    if (email) {
      Object.assign(email, updates);
      this.persist();
      return email;
    }
    return undefined;
  }

  // Notifications
  getNotifications(): NotificationMessage[] {
    return this.data.notifications;
  }

  addNotification(notif: NotificationMessage): NotificationMessage {
    this.data.notifications.unshift(notif);
    this.persist();
    return notif;
  }

  markNotificationRead(id: string): void {
    const notif = this.data.notifications.find((n) => n.id === id);
    if (notif) {
      notif.read = true;
      this.persist();
    }
  }

  clearNotifications(): void {
    this.data.notifications = [];
    this.persist();
  }

  // Configs
  getTelegramConfig(): TelegramConfig {
    return this.data.telegramConfig;
  }

  updateTelegramConfig(config: Partial<TelegramConfig>): TelegramConfig {
    this.data.telegramConfig = {
      ...this.data.telegramConfig,
      ...config,
    };
    this.persist();
    return this.data.telegramConfig;
  }

  getEmailDispatchConfig(): EmailDispatchConfig {
    return this.data.emailDispatchConfig || defaultEmailDispatchConfig;
  }

  updateEmailDispatchConfig(config: Partial<EmailDispatchConfig>): EmailDispatchConfig {
    this.data.emailDispatchConfig = {
      ...(this.data.emailDispatchConfig || defaultEmailDispatchConfig),
      ...config,
    };
    this.persist();
    return this.data.emailDispatchConfig;
  }

  getSchedulerConfig(): SchedulerConfig {
    return this.data.schedulerConfig;
  }

  updateSchedulerConfig(config: Partial<SchedulerConfig>): SchedulerConfig {
    this.data.schedulerConfig = {
      ...this.data.schedulerConfig,
      ...config,
    };
    this.persist();
    return this.data.schedulerConfig;
  }

  // Agent sessions
  getAgentSessions(): AgentRunSession[] {
    return this.data.agentSessions;
  }

  saveAgentSession(session: AgentRunSession): AgentRunSession {
    const idx = this.data.agentSessions.findIndex((s) => s.id === session.id);
    if (idx >= 0) {
      this.data.agentSessions[idx] = session;
    } else {
      this.data.agentSessions.unshift(session);
    }
    this.persist();
    return session;
  }

  // Stats calculation
  getDashboardStats(): DashboardStats {
    const totalJobs = this.data.jobs.length;
    const matches = this.data.matches;
    const apps = this.data.applications;

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
      ...this.data.notifications.slice(0, 5).map((n) => ({
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
  resetToDefaults() {
    this.data = {
      profile: defaultProfile,
      jobs: initialJobs,
      matches: initialMatches,
      applications: initialApplications,
      coverLetters: [],
      emails: initialEmails,
      telegramConfig: defaultTelegramConfig,
      emailDispatchConfig: defaultEmailDispatchConfig,
      schedulerConfig: defaultSchedulerConfig,
      notifications: initialNotifications,
      agentSessions: [],
    };
    this.persist();
  }
}

export const db = new Database();
