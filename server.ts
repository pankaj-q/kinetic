import express from 'express';
import path from 'path';
import fs from 'fs';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './server/routes/api';
import { SchedulerService } from './server/services/schedulerService';
import { initPostgres, isPostgresConnected } from './server/postgres';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const requestedPort = Number(process.env.PORT) || 3000;

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

  // Serve pre-built static files if available, otherwise use Vite middleware
  const distPath = path.join(process.cwd(), 'dist');
  const hasDist = fs.existsSync(path.join(distPath, 'index.html'));

  if (process.env.NODE_ENV === 'production' || hasDist) {
    app.use(express.static(distPath, { maxAge: '1h' }));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  function listenOnPort(port: number) {
    const server = app.listen(port, '0.0.0.0', () => {
      console.log(`🚀 Kinetic Server running and ready on port ${port} (http://localhost:${port})`);
      SchedulerService.startScheduler();
    });

    server.on('error', (err: any) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`⚠️ Port ${port} is busy/in-use. Trying port ${port + 1}...`);
        listenOnPort(port + 1);
      } else {
        console.error('Server error:', err);
      }
    });
  }

  listenOnPort(requestedPort);
}

startServer();
