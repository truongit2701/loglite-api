import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { errorMiddleware } from './common/middleware/error.middleware.js';
import { authenticate } from './common/middleware/auth.middleware.js';

// Import Routes
import authRoutes from './modules/auth/auth.routes.js';
import projectRoutes from './modules/projects/project.routes.js';
import logRoutes from './modules/logs/log.routes.js';
import adminRoutes from './modules/admin/admin.routes.js';
import { SystemConfig } from './modules/system-config/models/system-config.model.js';

const createApp = () => {
  const app = express();

  // Standard Middlewares
  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  // --- Public Routes ---
  app.use('/auth', authRoutes);
  
  // Public System Config
  app.get('/system-config/public', async (req, res) => {
    const config = await SystemConfig.findOne({ key: 'ingest_url' });
    res.json({ ingestUrl: config ? config.value : 'http://localhost:3001' });
  });

  // --- Protected Routes (Require Auth) ---
  app.use('/projects', authenticate, projectRoutes);
  app.use('/logs', logRoutes); // Logs ingestion is usually API Key based, not JWT
  app.use('/admin', authenticate, adminRoutes);

  // Stats API (Legacy or shared)
  app.get('/stats', authenticate, async (req, res) => {
    const { Log } = await import('./modules/logs/models/log.model.js');
    const { projectId } = req.query;
    if (!projectId) return res.status(400).json({ message: 'projectId is required' });
    
    const [total, errors] = await Promise.all([
      Log.countDocuments({ projectId }),
      Log.countDocuments({ projectId, level: 'error' })
    ]);
    res.json({ total, errors, services: 1 });
  });

  // Global Error Handler
  app.use(errorMiddleware);

  return app;
};

export default createApp;
