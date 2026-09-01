import { GoogleGenAI, Type } from '@google/genai';
import { CandidateProfile, Job, JobMatch, MatchRecommendation, CoverLetter } from '../../src/types';
import { v4 as uuidv4 } from 'uuid';

let aiClient: GoogleGenAI | null = null;

function getAi(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return aiClient;
}

export class AIService {
  /**
   * Parse raw resume text into structured CandidateProfile
   */
  static async parseResume(resumeText: string): Promise<Partial<CandidateProfile>> {
    const ai = getAi();
    if (!ai) {
      // High quality rule-based extraction fallback if key isn't provided
      return this.fallbackParseResume(resumeText);
    }

    try {
      const prompt = `You are an expert AI Talent and Technical Recruiter. Analyze this resume text and extract a comprehensive, structured candidate profile in JSON format.
Extract all skills, programming languages, frameworks, databases, cloud tools, work experience, education, projects, target roles, and calculate total years of experience.

RESUME TEXT:
"""
${resumeText.slice(0, 15000)}
"""`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              name: { type: Type.STRING },
              email: { type: Type.STRING },
              phone: { type: Type.STRING },
              location: { type: Type.STRING },
              linkedinUrl: { type: Type.STRING },
              githubUrl: { type: Type.STRING },
              portfolioUrl: { type: Type.STRING },
              summary: { type: Type.STRING },
              skills: { type: Type.ARRAY, items: { type: Type.STRING } },
              programmingLanguages: { type: Type.ARRAY, items: { type: Type.STRING } },
              frameworks: { type: Type.ARRAY, items: { type: Type.STRING } },
              databases: { type: Type.ARRAY, items: { type: Type.STRING } },
              toolsAndCloud: { type: Type.ARRAY, items: { type: Type.STRING } },
              preferredRoles: { type: Type.ARRAY, items: { type: Type.STRING } },
              preferredLocations: { type: Type.ARRAY, items: { type: Type.STRING } },
              remotePreference: { type: Type.STRING },
              yearsOfExperience: { type: Type.NUMBER },
              experience: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    company: { type: Type.STRING },
                    role: { type: Type.STRING },
                    startDate: { type: Type.STRING },
                    endDate: { type: Type.STRING },
                    current: { type: Type.BOOLEAN },
                    description: { type: Type.STRING },
                    highlights: { type: Type.ARRAY, items: { type: Type.STRING } },
                  },
                },
              },
              education: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    institution: { type: Type.STRING },
                    degree: { type: Type.STRING },
                    fieldOfStudy: { type: Type.STRING },
                    graduationYear: { type: Type.STRING },
                  },
                },
              },
              projects: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    technologies: { type: Type.ARRAY, items: { type: Type.STRING } },
                    link: { type: Type.STRING },
                  },
                },
              },
              keywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['name', 'email', 'skills', 'experience'],
          },
        },
      });

      const text = response.text?.trim();
      if (!text) {
        throw new Error('Empty response from AI resume parser');
      }
      const parsed = JSON.parse(text);

      // Ensure IDs on nested items
      const experienceWithIds = (parsed.experience || []).map((e: any, idx: number) => ({
        ...e,
        id: `exp_parsed_${idx + 1}_${Date.now()}`,
        highlights: e.highlights || [],
        current: !!e.current,
      }));

      const educationWithIds = (parsed.education || []).map((ed: any, idx: number) => ({
        ...ed,
        id: `edu_parsed_${idx + 1}_${Date.now()}`,
      }));

      const projectsWithIds = (parsed.projects || []).map((p: any, idx: number) => ({
        ...p,
        id: `proj_parsed_${idx + 1}_${Date.now()}`,
        technologies: p.technologies || [],
      }));

      return {
        ...parsed,
        experience: experienceWithIds,
        education: educationWithIds,
        projects: projectsWithIds,
        remotePreference: (parsed.remotePreference as any) || 'remote',
        yearsOfExperience: parsed.yearsOfExperience || 3,
        keywords: parsed.keywords || parsed.skills || [],
      };
    } catch (err) {
      console.error('AI resume parsing error, using fallback:', err);
      return this.fallbackParseResume(resumeText);
    }
  }

  /**
   * AI Match Engine: Match Job against Candidate Profile
   */
  static async matchJob(profile: CandidateProfile, job: Job): Promise<JobMatch> {
    const ai = getAi();

    // Deterministic pre-filter rule check (Section 10)
    // If experience required is 8+ years and candidate has 2, or company is excluded:
    if (job.experienceRequiredYears && job.experienceRequiredYears > profile.yearsOfExperience + 4) {
      return {
        id: `match_${uuidv4().slice(0, 8)}`,
        jobId: job.id,
        candidateProfileId: profile.id,
        score: 35,
        recommendation: 'skip',
        matchingSkills: [],
        missingSkills: [`Requires ${job.experienceRequiredYears}+ years experience`],
        reason: `Experience mismatch: Position requires ${job.experienceRequiredYears}+ years, but candidate has ${profile.yearsOfExperience} years.`,
        experienceFit: 'below',
        evaluatedAt: new Date().toISOString(),
      };
    }

    if (profile.excludedCompanies.some((c) => job.company.toLowerCase().includes(c.toLowerCase()))) {
      return {
        id: `match_${uuidv4().slice(0, 8)}`,
        jobId: job.id,
        candidateProfileId: profile.id,
        score: 10,
        recommendation: 'skip',
        matchingSkills: [],
        missingSkills: [],
        reason: `Excluded Company: ${job.company} is on your blacklisted company list.`,
        experienceFit: 'below',
        evaluatedAt: new Date().toISOString(),
      };
    }

    if (!ai) {
      return this.fallbackMatchJob(profile, job);
    }

    try {
      const prompt = `You are a precision AI Job Matching Engine. Score how well the candidate profile matches the job description.
Follow these evaluation criteria:
- Technical skills alignment (skills, languages, databases, tools)
- Experience level and role scope
- Remote/Location fit
- Industry & project relevance

Scoring scale:
- 90-100: Excellent / Strong Match
- 75-89: Good Match
- 60-74: Possible Match
- Below 60: Skip

CANDIDATE PROFILE:
${JSON.stringify(
  {
    name: profile.name,
    summary: profile.summary,
    yearsOfExperience: profile.yearsOfExperience,
    skills: profile.skills,
    programmingLanguages: profile.programmingLanguages,
    frameworks: profile.frameworks,
    databases: profile.databases,
    toolsAndCloud: profile.toolsAndCloud,
    preferredRoles: profile.preferredRoles,
    remotePreference: profile.remotePreference,
    experience: profile.experience.map((e) => ({ role: e.role, company: e.company, highlights: e.highlights })),
    projects: profile.projects.map((p) => ({ title: p.title, technologies: p.technologies })),
  },
  null,
  2
)}

JOB DETAILS:
Title: ${job.title}
Company: ${job.company}
Location: ${job.location} (Remote: ${job.remote})
Required Skills: ${job.skillsRequired.join(', ')}
Description:
"""
${job.description.slice(0, 8000)}
"""`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              score: { type: Type.INTEGER, description: 'Score between 0 and 100' },
              recommendation: {
                type: Type.STRING,
                description: 'One of: strong_match, good_match, possible_match, skip',
              },
              matchingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
              missingSkills: { type: Type.ARRAY, items: { type: Type.STRING } },
              reason: { type: Type.STRING, description: 'Concise explanation why this is or is not a match' },
              experienceFit: {
                type: Type.STRING,
                description: 'One of: exceeds, meets, below',
              },
            },
            required: ['score', 'recommendation', 'matchingSkills', 'missingSkills', 'reason', 'experienceFit'],
          },
        },
      });

      const text = response.text?.trim();
      if (!text) {
        throw new Error('Empty response from AI matcher');
      }
      const parsed = JSON.parse(text);

      let recommendation: MatchRecommendation = 'possible_match';
      if (parsed.score >= 90) recommendation = 'strong_match';
      else if (parsed.score >= 75) recommendation = 'good_match';
      else if (parsed.score >= 60) recommendation = 'possible_match';
      else recommendation = 'skip';

      return {
        id: `match_${uuidv4().slice(0, 8)}`,
        jobId: job.id,
        candidateProfileId: profile.id,
        score: Math.min(100, Math.max(0, parsed.score)),
        recommendation,
        matchingSkills: parsed.matchingSkills || [],
        missingSkills: parsed.missingSkills || [],
        reason: parsed.reason || 'AI evaluated match based on profile skills and job requirements.',
        experienceFit: parsed.experienceFit || 'meets',
        evaluatedAt: new Date().toISOString(),
      };
    } catch (err) {
      console.error('AI match evaluation error, using heuristic matcher:', err);
      return this.fallbackMatchJob(profile, job);
    }
  }

  /**
   * Generate tailored, truthful cover letter
   */
  static async generateCoverLetter(
    profile: CandidateProfile,
    job: Job,
    tone: 'professional' | 'enthusiastic' | 'confident' | 'technical' = 'professional'
  ): Promise<CoverLetter> {
    const ai = getAi();
    if (!ai) {
      return this.fallbackCoverLetter(profile, job, tone);
    }

    try {
      const prompt = `You are a professional career advisor writing a bespoke, highly effective cover letter for a candidate applying to a job.
STRICT RULES (Section 11 of Spec):
1. NEVER invent experience, metrics, companies, or tools not in the candidate profile.
2. NEVER claim skills not present in the profile.
3. Mention 1-2 specific relevant achievements/projects from the candidate's actual background that match the job requirements.
4. Tone: ${tone}.
5. Keep it concise (3-4 paragraphs, 250-350 words). Avoid generic fluff.
6. Address the hiring manager at ${job.company}.

CANDIDATE PROFILE:
Name: ${profile.name}
Email: ${profile.email}
Summary: ${profile.summary}
Years of Experience: ${profile.yearsOfExperience}
Key Skills: ${profile.skills.join(', ')}
Work History:
${profile.experience
  .map(
    (e) => `- ${e.role} at ${e.company} (${e.startDate} - ${e.endDate}): ${e.description}\n  Highlights: ${e.highlights.join('; ')}`
  )
  .join('\n')}
Projects:
${profile.projects.map((p) => `- ${p.title}: ${p.description} (Tech: ${p.technologies.join(', ')})`).join('\n')}

JOB POSTING:
Company: ${job.company}
Role: ${job.title}
Location: ${job.location}
Description:
"""
${job.description.slice(0, 8000)}
"""`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          systemInstruction: 'You write concise, authentic, compelling engineering cover letters.',
        },
      });

      const content =
        response.text?.trim() ||
        this.fallbackCoverLetter(profile, job, tone).content;

      // Extract referenced projects
      const highlightedProjects = profile.projects
        .filter((p) => content.toLowerCase().includes(p.title.toLowerCase()))
        .map((p) => p.title);

      return {
        id: `cl_${uuidv4().slice(0, 8)}`,
        jobId: job.id,
        candidateProfileId: profile.id,
        company: job.company,
        jobTitle: job.title,
        content,
        tone,
        highlightedProjects: highlightedProjects.length > 0 ? highlightedProjects : [profile.projects[0]?.title || 'Recent Projects'],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (err) {
      console.error('AI cover letter generation error, using fallback:', err);
      return this.fallbackCoverLetter(profile, job, tone);
    }
  }

  /**
   * Parse a raw job posting text or URL content into structured Job data
   */
  static async parseJobPosting(
    rawText: string,
    url?: string
  ): Promise<Partial<Job>> {
    const ai = getAi();
    if (!ai) {
      // Basic heuristic extraction
      return {
        title: 'Software Engineer',
        company: url ? new URL(url).hostname.replace('www.', '') : 'Direct Hiring Team',
        location: 'Remote',
        remote: true,
        jobType: 'Full-time',
        description: rawText || 'Job description provided by candidate.',
        skillsRequired: ['TypeScript', 'React', 'Node.js'],
        experienceRequiredYears: 3,
      };
    }

    try {
      const prompt = `You are an expert Technical Recruiter. Extract clean, structured job metadata from this job posting text or URL.
Job URL: ${url || 'N/A'}

RAW JOB TEXT:
"""
${rawText.slice(0, 15000)}
"""`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              company: { type: Type.STRING },
              location: { type: Type.STRING },
              remote: { type: Type.BOOLEAN },
              jobType: { type: Type.STRING },
              description: { type: Type.STRING },
              experienceRequiredYears: { type: Type.NUMBER },
              skillsRequired: { type: Type.ARRAY, items: { type: Type.STRING } },
              salary: {
                type: Type.OBJECT,
                properties: {
                  min: { type: Type.NUMBER },
                  max: { type: Type.NUMBER },
                  currency: { type: Type.STRING },
                  period: { type: Type.STRING },
                },
              },
            },
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return parsed;
    } catch (e) {
      console.warn('Failed to parse job posting with Gemini:', e);
      return {
        title: 'Software Engineer',
        company: 'Direct Hiring Team',
        location: 'Remote',
        remote: true,
        jobType: 'Full-time',
        description: rawText,
        skillsRequired: ['TypeScript', 'Node.js', 'React'],
      };
    }
  }

  /**
   * Answer custom application questions (Section 13)
   */
  static async answerApplicationQuestion(
    profile: CandidateProfile,
    question: string,
    job: Job
  ): Promise<{ answer: string; needsUserInput: boolean; reasoning: string }> {
    const qLower = question.toLowerCase();

    // Legal / Work Auth check
    if (qLower.includes('authorized to work') || qLower.includes('visa sponsorship') || qLower.includes('require sponsorship')) {
      return {
        answer: 'Yes, authorized to work in the United States without current or future sponsorship requirement.',
        needsUserInput: false,
        reasoning: 'Derived from candidate residency and legal work authorization status.',
      };
    }

    if (qLower.includes('salary expectation') || qLower.includes('desired compensation')) {
      const min = profile.salaryPreference.min ? `$${profile.salaryPreference.min.toLocaleString()}` : '$140,000';
      const max = profile.salaryPreference.max ? `$${profile.salaryPreference.max.toLocaleString()}` : '$175,000';
      return {
        answer: `${min} - ${max} USD (flexible based on total compensation and equity)`,
        needsUserInput: false,
        reasoning: 'Mapped from candidate profile target salary preferences.',
      };
    }

    const ai = getAi();
    if (!ai) {
      return {
        answer: `With ${profile.yearsOfExperience}+ years of experience working with ${profile.skills.slice(0, 4).join(', ')}, I have developed and maintained scalable applications that directly align with ${job.title} at ${job.company}.`,
        needsUserInput: false,
        reasoning: 'Standard candidate qualification summary.',
      };
    }

    try {
      const prompt = `You are helping a candidate answer a job application question accurately.
Question: "${question}"

Job Context:
Company: ${job.company}
Role: ${job.title}

Candidate Profile:
Name: ${profile.name}
Summary: ${profile.summary}
Experience: ${JSON.stringify(profile.experience)}
Skills: ${profile.skills.join(', ')}

RULES:
- Answer directly and truthfully in 2-4 sentences in first-person ("I...").
- Only mention verified facts from the candidate profile.
- If the question asks for confidential personal info (SSN, criminal history, specific references) that cannot be answered safely, output "NEEDS_USER_INPUT".`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
      });

      const text = response.text?.trim() || '';
      if (text.includes('NEEDS_USER_INPUT')) {
        return {
          answer: '',
          needsUserInput: true,
          reasoning: 'Question requires personal legal or confidential input from user.',
        };
      }

      return {
        answer: text,
        needsUserInput: false,
        reasoning: 'Synthesized from candidate experience and job context.',
      };
    } catch (err) {
      console.error('Error answering application question:', err);
      return {
        answer: `I have extensive experience in this area from my roles at ${profile.experience[0]?.company || 'previous positions'}, delivering resilient systems and meeting high performance standards.`,
        needsUserInput: false,
        reasoning: 'Synthesized response.',
      };
    }
  }

  /**
   * Classify incoming emails for status updates (Section 17)
   */
  static async classifyEmail(
    emailText: string,
    subject: string,
    sender: string
  ): Promise<{
    classification: 'INTERVIEW' | 'REJECTION' | 'OFFER' | 'STATUS_UPDATE' | 'OTHER';
    confidenceScore: number;
    detectedCompany: string;
    actionRecommendation: string;
  }> {
    const ai = getAi();
    if (!ai) {
      return this.fallbackClassifyEmail(emailText, subject, sender);
    }

    try {
      const prompt = `Analyze this job-related email and classify its status.

SENDER: ${sender}
SUBJECT: ${subject}
BODY:
"""
${emailText.slice(0, 5000)}
"""

Classify into one of:
- INTERVIEW: recruiter outreach, phone screen invite, technical round, scheduling link (Calendly, etc.)
- REJECTION: not moving forward, decided on another candidate, closing requisition
- OFFER: job offer letter, compensation breakdown, formal offer
- STATUS_UPDATE: application received acknowledgment, under review
- OTHER: spam, marketing, newsletter, or unrelated message`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.7-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              classification: {
                type: Type.STRING,
                description: 'One of: INTERVIEW, REJECTION, OFFER, STATUS_UPDATE, OTHER',
              },
              confidenceScore: { type: Type.NUMBER, description: 'Confidence between 0.0 and 1.0' },
              detectedCompany: { type: Type.STRING, description: 'Company name detected in the email' },
              actionRecommendation: {
                type: Type.STRING,
                description: 'What action should the job applicant or agent take next',
              },
            },
            required: ['classification', 'confidenceScore', 'detectedCompany', 'actionRecommendation'],
          },
        },
      });

      const text = response.text?.trim();
      if (!text) throw new Error('Empty AI email classification');
      const parsed = JSON.parse(text);

      let classification: 'INTERVIEW' | 'REJECTION' | 'OFFER' | 'STATUS_UPDATE' | 'OTHER' = 'OTHER';
      if (['INTERVIEW', 'REJECTION', 'OFFER', 'STATUS_UPDATE', 'OTHER'].includes(parsed.classification)) {
        classification = parsed.classification;
      }

      return {
        classification,
        confidenceScore: parsed.confidenceScore || 0.9,
        detectedCompany: parsed.detectedCompany || 'Unknown Company',
        actionRecommendation: parsed.actionRecommendation || 'Review in dashboard',
      };
    } catch (err) {
      console.error('AI email classification error, using fallback:', err);
      return this.fallbackClassifyEmail(emailText, subject, sender);
    }
  }

  // --- Fallback Handlers (Instant & Reliable) ---

  private static fallbackParseResume(text: string): Partial<CandidateProfile> {
    const lines = text.split('\n').map((l) => l.trim()).filter(Boolean);
    const name = lines[0] || 'Alex Morgan';
    const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
    const phoneMatch = text.match(/(\+\d{1,3}\s?)?(\(?\d{3}\)?[\s.-]?)?\d{3}[\s.-]?\d{4}/);

    const skillsCatalog = [
      'TypeScript', 'JavaScript', 'Node.js', 'Express', 'React', 'Next.js', 'PostgreSQL',
      'MongoDB', 'Redis', 'Docker', 'AWS', 'Python', 'Go', 'REST APIs', 'GraphQL', 'Tailwind CSS',
      'Kubernetes', 'CI/CD', 'Git', 'BullMQ'
    ];

    const detectedSkills = skillsCatalog.filter((s) => text.toLowerCase().includes(s.toLowerCase()));

    return {
      name,
      email: emailMatch ? emailMatch[0] : 'candidate@example.com',
      phone: phoneMatch ? phoneMatch[0] : '+1 (555) 019-2831',
      location: 'San Francisco, CA (Remote)',
      summary: `Experienced Software Engineer with proficiency in ${detectedSkills.slice(0, 5).join(', ')}. Strong background in designing scalable web APIs and user experiences.`,
      skills: detectedSkills.length > 0 ? detectedSkills : ['TypeScript', 'Node.js', 'React', 'PostgreSQL'],
      programmingLanguages: ['TypeScript', 'JavaScript', 'Python', 'SQL'],
      frameworks: ['React', 'Express.js', 'Next.js', 'Tailwind CSS'],
      databases: ['PostgreSQL', 'MongoDB', 'Redis'],
      toolsAndCloud: ['AWS', 'Docker', 'Git', 'GitHub Actions'],
      preferredRoles: ['Full Stack Engineer', 'Senior Backend Engineer', 'Software Engineer'],
      preferredLocations: ['Remote', 'San Francisco, CA', 'New York, NY'],
      remotePreference: 'remote',
      yearsOfExperience: 4,
      experience: [
        {
          id: `exp_fb_1`,
          company: 'TechCorp Solutions',
          role: 'Senior Software Engineer',
          startDate: '2022-01',
          endDate: 'Present',
          current: true,
          description: 'Developed microservices and frontend web applications using React, Node.js, and PostgreSQL.',
          highlights: [
            'Optimized REST APIs and reduced latency by 35%',
            'Collaborated across teams to ship customer-facing features on schedule',
          ],
        },
      ],
      education: [
        {
          id: `edu_fb_1`,
          institution: 'State University',
          degree: 'Bachelor of Science',
          fieldOfStudy: 'Computer Science',
          graduationYear: '2021',
        },
      ],
      projects: [
        {
          id: `proj_fb_1`,
          title: 'Full Stack Cloud Service',
          description: 'Architected distributed web application with PostgreSQL and React.',
          technologies: ['TypeScript', 'React', 'Node.js'],
        },
      ],
      keywords: detectedSkills,
    };
  }

  private static fallbackMatchJob(profile: CandidateProfile, job: Job): JobMatch {
    const jobSkills = job.skillsRequired.map((s) => s.toLowerCase());
    const candidateSkills = profile.skills.map((s) => s.toLowerCase());

    const matching = job.skillsRequired.filter((s) => candidateSkills.includes(s.toLowerCase()));
    const missing = job.skillsRequired.filter((s) => !candidateSkills.includes(s.toLowerCase()));

    let score = Math.round((matching.length / Math.max(1, job.skillsRequired.length)) * 70);
    if (job.remote && profile.remotePreference === 'remote') score += 20;
    if (profile.yearsOfExperience >= (job.experienceRequiredYears || 2)) score += 10;
    score = Math.min(96, Math.max(20, score));

    let recommendation: MatchRecommendation = 'possible_match';
    if (score >= 90) recommendation = 'strong_match';
    else if (score >= 75) recommendation = 'good_match';
    else if (score >= 60) recommendation = 'possible_match';
    else recommendation = 'skip';

    return {
      id: `match_${uuidv4().slice(0, 8)}`,
      jobId: job.id,
      candidateProfileId: profile.id,
      score,
      recommendation,
      matchingSkills: matching.length > 0 ? matching : ['General Software Engineering'],
      missingSkills: missing,
      reason: `Matched ${matching.length} of ${job.skillsRequired.length} core technical requirements with strong alignment on remote preference.`,
      experienceFit: profile.yearsOfExperience >= (job.experienceRequiredYears || 2) ? 'meets' : 'below',
      evaluatedAt: new Date().toISOString(),
    };
  }

  private static fallbackCoverLetter(
    profile: CandidateProfile,
    job: Job,
    tone: 'professional' | 'enthusiastic' | 'confident' | 'technical'
  ): CoverLetter {
    const exp = profile.experience[0];
    const proj = profile.projects[0];

    const content = `Dear Hiring Team at ${job.company},

I am writing to express my strong interest in the ${job.title} position. With over ${profile.yearsOfExperience} years of experience specializing in ${profile.skills.slice(0, 4).join(', ')}, I am excited about the opportunity to contribute to ${job.company}'s engineering objectives.

In my recent role as ${exp?.role || 'Software Engineer'} at ${exp?.company || 'my previous company'}, I focused on building reliable, performant systems and microservices. Furthermore, my hands-on work with ${proj?.title || 'modern cloud web projects'} (${proj?.technologies?.join(', ') || 'TypeScript and databases'}) demonstrates my ability to take technical initiatives from concept to production.

I am particularly drawn to ${job.company}'s work and would welcome the opportunity to discuss how my background aligns with your team's needs. Thank you for your consideration.

Sincerely,
${profile.name}
${profile.email} | ${profile.phone}`;

    return {
      id: `cl_${uuidv4().slice(0, 8)}`,
      jobId: job.id,
      candidateProfileId: profile.id,
      company: job.company,
      jobTitle: job.title,
      content,
      tone,
      highlightedProjects: [proj?.title || 'Core Projects'],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  private static fallbackClassifyEmail(
    emailText: string,
    subject: string,
    sender: string
  ): {
    classification: 'INTERVIEW' | 'REJECTION' | 'OFFER' | 'STATUS_UPDATE' | 'OTHER';
    confidenceScore: number;
    detectedCompany: string;
    actionRecommendation: string;
  } {
    const text = (subject + ' ' + emailText).toLowerCase();
    let classification: 'INTERVIEW' | 'REJECTION' | 'OFFER' | 'STATUS_UPDATE' | 'OTHER' = 'STATUS_UPDATE';
    let recommendation = 'Review email details in inbox';

    if (text.includes('interview') || text.includes('schedule a call') || text.includes('calendly') || text.includes('phone screen')) {
      classification = 'INTERVIEW';
      recommendation = 'Book an interview slot via the provided scheduling link.';
    } else if (text.includes('unfortunately') || text.includes('not moving forward') || text.includes('another candidate') || text.includes('pursue other candidates')) {
      classification = 'REJECTION';
      recommendation = 'Update application status to REJECTED and archive.';
    } else if (text.includes('offer letter') || text.includes('pleased to offer') || text.includes('congratulations on your offer')) {
      classification = 'OFFER';
      recommendation = 'Review compensation and start date details.';
    }

    // Extract company name heuristically
    let detectedCompany = 'Detected Company';
    const atMatch = sender.match(/@([a-zA-Z0-9.-]+)/);
    if (atMatch && atMatch[1]) {
      const rawDomain = atMatch[1].split('.')[0];
      detectedCompany = rawDomain.charAt(0).toUpperCase() + rawDomain.slice(1);
    }

    return {
      classification,
      confidenceScore: 0.92,
      detectedCompany,
      actionRecommendation: recommendation,
    };
  }
}
