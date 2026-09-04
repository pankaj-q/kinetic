import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

async function runMigration() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.error('❌ Error: DATABASE_URL is not defined in .env');
    process.exit(1);
  }

  console.log('🐘 Connecting to PostgreSQL database...');
  const client = new Client({
    connectionString,
    ssl: connectionString.includes('sslmode=require') ? { rejectUnauthorized: false } : false,
  });

  try {
    await client.connect();
    console.log('✓ Successfully connected to PostgreSQL server.');

    // 1. Try enabling pgvector
    try {
      await client.query('CREATE EXTENSION IF NOT EXISTS vector;');
      console.log('✓ pgvector extension verified/enabled.');
    } catch (err: any) {
      console.log('ℹ️ Note: pgvector extension not installed; proceeding with standard relational schema.');
    }

    console.log('⚡ Creating tables & relational schema...');

    // 2. Execute DDL Schema
    await client.query(`
      -- Candidates Profile Table
      CREATE TABLE IF NOT EXISTS candidates (
        id TEXT PRIMARY KEY,
        name TEXT,
        email TEXT,
        data JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Jobs Table
      CREATE TABLE IF NOT EXISTS jobs (
        id TEXT PRIMARY KEY,
        external_id TEXT,
        source TEXT,
        title TEXT,
        company TEXT,
        location TEXT,
        remote BOOLEAN DEFAULT false,
        job_type TEXT,
        description TEXT,
        url TEXT,
        salary JSONB,
        experience_required_years NUMERIC,
        skills_required JSONB,
        posted_at TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        data JSONB
      );

      -- Job Matches Table
      CREATE TABLE IF NOT EXISTS job_matches (
        id TEXT,
        job_id TEXT PRIMARY KEY REFERENCES jobs(id) ON DELETE CASCADE,
        score NUMERIC NOT NULL,
        recommendation TEXT,
        reasons JSONB,
        missing_skills JSONB,
        matching_skills JSONB,
        salary_fit TEXT,
        experience_fit TEXT,
        location_fit TEXT,
        fit_summary TEXT,
        evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        data JSONB
      );

      -- Applications Pipeline Table
      CREATE TABLE IF NOT EXISTS applications (
        id TEXT PRIMARY KEY,
        job_id TEXT,
        status TEXT NOT NULL,
        applied_at TIMESTAMP WITH TIME ZONE,
        scheduled_for TIMESTAMP WITH TIME ZONE,
        notes TEXT,
        history JSONB,
        answers JSONB,
        custom_resume_url TEXT,
        data JSONB,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Cover Letters Table
      CREATE TABLE IF NOT EXISTS cover_letters (
        id TEXT PRIMARY KEY,
        job_id TEXT,
        content TEXT NOT NULL,
        key_highlights JSONB,
        tone TEXT,
        word_count INT,
        generated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        citations JSONB,
        verified BOOLEAN DEFAULT true,
        data JSONB
      );

      -- Recruiter & Inbound Email Events Table
      CREATE TABLE IF NOT EXISTS email_events (
        id TEXT PRIMARY KEY,
        application_id TEXT,
        type TEXT NOT NULL,
        sender TEXT,
        subject TEXT,
        snippet TEXT,
        received_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        classification TEXT,
        action_taken TEXT,
        details JSONB
      );

      -- Agent Run Sessions & Execution Audit Logs
      CREATE TABLE IF NOT EXISTS agent_sessions (
        id TEXT PRIMARY KEY,
        start_time TIMESTAMP WITH TIME ZONE,
        end_time TIMESTAMP WITH TIME ZONE,
        status TEXT,
        goal TEXT,
        logs JSONB,
        stats JSONB,
        error TEXT
      );

      -- System Settings & Configurations
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value JSONB NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Fast Indexing
      CREATE INDEX IF NOT EXISTS idx_jobs_company ON jobs(company);
      CREATE INDEX IF NOT EXISTS idx_jobs_posted_at ON jobs(posted_at DESC);
      CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
      CREATE INDEX IF NOT EXISTS idx_job_matches_score ON job_matches(score DESC);
      CREATE INDEX IF NOT EXISTS idx_email_events_received ON email_events(received_at DESC);

      -- Ensure columns exist if tables were created earlier
      ALTER TABLE job_matches ADD COLUMN IF NOT EXISTS id TEXT;
      ALTER TABLE job_matches ADD COLUMN IF NOT EXISTS recommendation TEXT;
      ALTER TABLE job_matches ADD COLUMN IF NOT EXISTS matching_skills JSONB;
      ALTER TABLE job_matches ADD COLUMN IF NOT EXISTS data JSONB;
      ALTER TABLE job_matches ALTER COLUMN salary_fit TYPE TEXT USING salary_fit::TEXT;
      ALTER TABLE job_matches ALTER COLUMN experience_fit TYPE TEXT USING experience_fit::TEXT;
      ALTER TABLE job_matches ALTER COLUMN location_fit TYPE TEXT USING location_fit::TEXT;
      ALTER TABLE cover_letters ADD COLUMN IF NOT EXISTS data JSONB;
    `);

    console.log('✓ All 8 relational tables & indexes created successfully.');

    // 3. Migrate & Seed data from local store.json if available
    const storePath = path.join(process.cwd(), 'data', 'store.json');
    if (fs.existsSync(storePath)) {
      console.log('📦 Seeding initial data from local store.json into PostgreSQL...');
      const store = JSON.parse(fs.readFileSync(storePath, 'utf-8'));

      // Seed Candidate Profile
      if (store.profile) {
        await client.query(
          `INSERT INTO candidates (id, name, email, data, updated_at)
           VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
           ON CONFLICT (id) DO UPDATE SET name = $2, email = $3, data = $4, updated_at = CURRENT_TIMESTAMP`,
          [store.profile.id || 'profile_default_01', store.profile.name, store.profile.email, JSON.stringify(store.profile)]
        );
        console.log('  ✓ Candidate profile seeded.');
      }

      // Seed Jobs
      if (Array.isArray(store.jobs)) {
        for (const job of store.jobs) {
          await client.query(
            `INSERT INTO jobs (id, external_id, source, title, company, location, remote, job_type, description, url, salary, experience_required_years, skills_required, posted_at, data)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15)
             ON CONFLICT (id) DO NOTHING`,
            [
              job.id,
              job.externalId || null,
              job.source,
              job.title,
              job.company,
              job.location,
              job.remote || false,
              job.jobType || 'Full-time',
              job.description,
              job.url,
              JSON.stringify(job.salary || null),
              job.experienceRequiredYears || null,
              JSON.stringify(job.skillsRequired || []),
              job.postedAt ? new Date(job.postedAt) : new Date(),
              JSON.stringify(job),
            ]
          );
        }
        console.log(`  ✓ ${store.jobs.length} jobs seeded.`);
      }

      // Seed Job Matches
      if (Array.isArray(store.matches)) {
        for (const match of store.matches) {
          await client.query(
            `INSERT INTO job_matches (id, job_id, score, recommendation, reasons, missing_skills, matching_skills, salary_fit, experience_fit, location_fit, fit_summary, evaluated_at, data)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
             ON CONFLICT (job_id) DO UPDATE SET score = $3, reasons = $5, missing_skills = $6, matching_skills = $7`,
            [
              match.id || `match_${match.jobId}`,
              match.jobId,
              match.score,
              match.recommendation || 'APPLY_NOW',
              JSON.stringify(match.reasons || (match.reason ? [match.reason] : [])),
              JSON.stringify(match.missingSkills || []),
              JSON.stringify(match.matchingSkills || match.matchedSkills || []),
              String(match.salaryFit ?? 'fits'),
              String(match.experienceFit ?? 'meets'),
              String(match.locationFit ?? 'remote_match'),
              match.fitSummary || match.reason || '',
              match.evaluatedAt ? new Date(match.evaluatedAt) : new Date(),
              JSON.stringify(match),
            ]
          );
        }
        console.log(`  ✓ ${store.matches.length} job match scores seeded.`);
      }

      // Seed Applications
      if (Array.isArray(store.applications)) {
        for (const app of store.applications) {
          await client.query(
            `INSERT INTO applications (id, job_id, status, applied_at, scheduled_for, notes, history, answers, custom_resume_url, data)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             ON CONFLICT (id) DO UPDATE SET status = $3, notes = $6`,
            [
              app.id,
              app.jobId,
              app.status,
              app.appliedAt ? new Date(app.appliedAt) : null,
              app.scheduledFor ? new Date(app.scheduledFor) : null,
              app.notes || '',
              JSON.stringify(app.history || []),
              JSON.stringify(app.answers || {}),
              app.customResumeUrl || null,
              JSON.stringify(app),
            ]
          );
        }
        console.log(`  ✓ ${store.applications.length} applications seeded.`);
      }

      // Seed Cover Letters
      if (Array.isArray(store.coverLetters)) {
        for (const cl of store.coverLetters) {
          await client.query(
            `INSERT INTO cover_letters (id, job_id, content, key_highlights, tone, word_count, generated_at, citations, verified, data)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             ON CONFLICT (id) DO NOTHING`,
            [
              cl.id,
              cl.jobId,
              cl.content,
              JSON.stringify(cl.keyHighlights || []),
              cl.tone || 'Professional',
              cl.wordCount || cl.content.split(/\s+/).length,
              cl.generatedAt ? new Date(cl.generatedAt) : new Date(),
              JSON.stringify(cl.citations || []),
              cl.verified ?? true,
              JSON.stringify(cl),
            ]
          );
        }
        console.log(`  ✓ ${store.coverLetters.length} cover letters seeded.`);
      }

      // Seed Email Events
      if (Array.isArray(store.emails)) {
        for (const em of store.emails) {
          await client.query(
            `INSERT INTO email_events (id, application_id, type, sender, subject, snippet, received_at, classification, action_taken, details)
             VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
             ON CONFLICT (id) DO NOTHING`,
            [
              em.id,
              em.applicationId || null,
              em.type || 'RECRUITER_RESPONSE',
              em.sender,
              em.subject,
              em.snippet,
              em.receivedAt ? new Date(em.receivedAt) : new Date(),
              em.classification || 'INFO',
              em.actionTaken || 'LOGGED',
              JSON.stringify(em),
            ]
          );
        }
        console.log(`  ✓ ${store.emails.length} email events seeded.`);
      }

      // Seed Settings
      const settingsToSeed = [
        { key: 'telegram_config', value: store.telegramConfig },
        { key: 'email_dispatch_config', value: store.emailDispatchConfig },
        { key: 'scheduler_config', value: store.schedulerConfig },
      ];

      for (const s of settingsToSeed) {
        if (s.value) {
          await client.query(
            `INSERT INTO settings (key, value, updated_at)
             VALUES ($1, $2, CURRENT_TIMESTAMP)
             ON CONFLICT (key) DO UPDATE SET value = $2, updated_at = CURRENT_TIMESTAMP`,
            [s.key, JSON.stringify(s.value)]
          );
        }
      }
      console.log('  ✓ System settings seeded.');
    }

    console.log('\n🎉 PostgreSQL Migration & Seeding COMPLETED successfully!');
  } catch (err: any) {
    console.error('❌ Migration failed:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runMigration();
