import { Pool, PoolClient } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

let pool: Pool | null = null;
let isConnected = false;

export function getPostgresPool(): Pool | null {
  if (pool) return pool;

  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    console.log('ℹ️ No DATABASE_URL found in environment. Using local JSON store.');
    return null;
  }

  try {
    pool = new Pool({
      connectionString,
      ssl: connectionString.includes('sslmode=require') ? { rejectUnauthorized: false } : false,
      max: 10,
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    });

    pool.on('error', (err) => {
      console.error('Unexpected PostgreSQL client error on idle client:', err);
    });

    return pool;
  } catch (err) {
    console.error('Failed to initialize PostgreSQL pool:', err);
    return null;
  }
}

export async function query(text: string, params?: any[]) {
  const p = getPostgresPool();
  if (!p) throw new Error('PostgreSQL pool not initialized');
  return p.query(text, params);
}

export async function initPostgres(): Promise<boolean> {
  const p = getPostgresPool();
  if (!p) return false;

  let client: PoolClient | null = null;
  try {
    client = await p.connect();
    isConnected = true;
    console.log('🐘 PostgreSQL connected successfully!');

    // 1. Try enabling pgvector extension (if available)
    try {
      await client.query('CREATE EXTENSION IF NOT EXISTS vector;');
      console.log('⚡ pgvector extension enabled for vector similarity search.');
    } catch {
      console.log('ℹ️ pgvector extension not installed on this server; standard relational mode active.');
    }

    // 2. Initialize Core Relational Tables
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
        verified BOOLEAN DEFAULT true
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

      -- Indexes for fast query performance
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

    console.log('✅ PostgreSQL schema and relational tables verified & ready.');
    return true;
  } catch (err: any) {
    isConnected = false;
    console.warn(`⚠️ PostgreSQL connection attempt failed: ${err.message}. Falling back to local JSON store.`);
    return false;
  } finally {
    if (client) client.release();
  }
}

export function isPostgresConnected(): boolean {
  return isConnected;
}
