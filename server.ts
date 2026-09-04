import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './server/routes/api';
import { SchedulerService } from './server/services/schedulerService';
import { initPostgres, isPostgresConnected } from './server/postgres';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT) || 3005;

  // Initialize PostgreSQL database connection and schema
  await initPostgres();

  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // API Routes mounted first
  app.use('/api', apiRouter);

  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'Kinetic Core Engine',
      postgres: isPostgresConnected() ? 'connected' : 'local_json_fallback',
      timestamp: new Date().toISOString()
    });
  });

  // Vite middleware in dev, static files in prod
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Kinetic Server running on port ${PORT}`);
    SchedulerService.startScheduler();
  });
}

startServer();
