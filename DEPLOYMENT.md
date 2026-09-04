# JobAgent AI OS — Production Deployment Guide

This guide covers 3 production deployment options for **JobAgent AI OS (Kinetic)**:

1. **[Option A: Railway / Render (Recommended - Fastest 1-Click Setup)](#option-a-railway--render-recommended)**
2. **[Option B: Docker & Docker Compose (Self-Hosted VPS / AWS EC2 / DigitalOcean)](#option-b-docker--docker-compose-self-hosted)**
3. **[Option C: Vercel + Managed Postgres (Neon / Supabase)](#option-c-vercel--serverless-postgres)**

---

## Required Environment Variables

| Variable | Description | Example |
| :--- | :--- | :--- |
| `NODE_ENV` | Runtime environment | `production` |
| `PORT` | Web server listening port | `3005` (or `10000` on Render) |
| `DATABASE_URL` | PostgreSQL connection URI | `postgresql://user:pass@host:5432/kinetic` |
| `GEMINI_API_KEY` | Google Gemini API Key | `AIzaSy...` |
| `TELEGRAM_BOT_TOKEN` | Optional Telegram Bot Token | `8665776997:AAFc0KV...` |
| `TELEGRAM_CHAT_ID` | Optional Telegram Chat ID | `1276866292` |

---

## Option A: Railway / Render (Recommended)

### Deploying on Railway (1-Click)
1. Push your repository to **GitHub**.
2. Log into [Railway.app](https://railway.app) and click **"New Project"** → **"Deploy from GitHub repo"**.
3. In the project canvas, click **"Add Service"** → **"Database"** → **"Add PostgreSQL"**.
4. In your Web Service settings, add the environment variables:
   - `GEMINI_API_KEY`: *Your Gemini API Key*
   - `TELEGRAM_BOT_TOKEN`: *Your Telegram Bot Token*
   - `TELEGRAM_CHAT_ID`: *Your Telegram Chat ID*
   - `DATABASE_URL`: `${{Postgres.DATABASE_URL}}` *(Automatically linked by Railway)*
5. Set Build & Start Command:
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm run db:migrate && npm start`
6. Click **Deploy**. Railway will build the app, run the PostgreSQL migration, and generate your live HTTPS domain!

### Deploying on Render (Blueprint)
1. Push repository to **GitHub**.
2. Log into [Render.com](https://render.com) and click **"New"** → **"Blueprint"**.
3. Select this repository. Render will detect `render.yaml` and provision both:
   - Managed PostgreSQL database (`jobagent-postgres`)
   - Node.js Web service (`jobagent-ai-os`)
4. Fill in `GEMINI_API_KEY`, `TELEGRAM_BOT_TOKEN`, and `TELEGRAM_CHAT_ID` in the Render dashboard.
5. Click **Apply**. Render will deploy with SSL and live health checks.

---

## Option B: Docker & Docker Compose (Self-Hosted)

Use this option to deploy on any VPS (DigitalOcean Droplet, Linode, AWS EC2, Hetzner, or local server).

### 1. Prerequisites
Ensure `docker` and `docker compose` are installed on your server:
```bash
docker --version
docker compose version
```

### 2. Configure Environment
Create a `.env` file in the project root on your server:
```env
PORT=3005
POSTGRES_USER=postgres
POSTGRES_PASSWORD=your_secure_postgres_password
POSTGRES_DB=kinetic
POSTGRES_PORT=5432

GEMINI_API_KEY=your_gemini_api_key
TELEGRAM_BOT_TOKEN=8665776997:AAFc0KV08DV2Kux_qXIkdq4Y4jLhLDu424s
TELEGRAM_CHAT_ID=1276866292
```

### 3. Build & Launch Containers
```bash
# Build and start PostgreSQL (with pgvector) & JobAgent Web App in background
docker compose up -d --build
```

### 4. Run Initial Database Migration & Seeding
```bash
# Execute schema migration inside the running app container
docker compose exec app npm run db:migrate
```

### 5. Verify Container Health
```bash
docker compose ps
docker compose logs -f app
```
The application will be accessible at `http://your-server-ip:3005` (or behind an Nginx reverse proxy with SSL).

---

## Option C: Vercel + Serverless Postgres (Neon / Supabase)

1. Provision a free PostgreSQL database on [Neon.tech](https://neon.tech) or [Supabase.com](https://supabase.com).
2. Copy your pooled connection string (e.g. `postgresql://user:pass@ep-cool-fog.neon.tech/kinetic?sslmode=require`).
3. Run the migration script locally to initialize tables:
   ```bash
   DATABASE_URL="your_neon_or_supabase_url" npm run db:migrate
   ```
4. Push your repo to GitHub and import into [Vercel](https://vercel.com).
5. Add `DATABASE_URL`, `GEMINI_API_KEY`, `TELEGRAM_BOT_TOKEN`, and `TELEGRAM_CHAT_ID` in Vercel Environment Variables.
6. Deploy!

---

## Post-Deployment Checklist

- [ ] Check `/api/health` endpoint on your live domain (`{"status": "ok", "postgres": "connected"}`).
- [ ] Open **Resume Studio** and verify resume profile loads.
- [ ] Trigger **"Send Test Alert"** in Settings to confirm Telegram bot alerts.
- [ ] Confirm the 10:00 AM daily background job scheduler is active in server logs.
