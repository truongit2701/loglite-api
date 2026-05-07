import { Router } from 'express';
import { Project } from '../projects/models/project.model.js';
import { SystemConfig, PlatformType, DatabaseType } from '../system-config/models/system-config.model.js';
import { asyncHandler } from '../../common/utils/asyncHandler.js';

const router = Router();

// --- Tech Catalog Management ---

// Platforms
router.get('/platforms', asyncHandler(async (req, res) => {
  const platforms = await PlatformType.find();
  res.json(platforms);
}));

router.post('/platforms', asyncHandler(async (req, res) => {
  const platform = await PlatformType.create(req.body);
  res.status(201).json(platform);
}));

router.delete('/platforms/:id', asyncHandler(async (req, res) => {
  await PlatformType.findByIdAndDelete(req.params.id);
  res.status(204).end();
}));

// Databases
router.get('/databases', asyncHandler(async (req, res) => {
  const databases = await DatabaseType.find();
  res.json(databases);
}));

router.post('/databases', asyncHandler(async (req, res) => {
  const database = await DatabaseType.create(req.body);
  res.status(201).json(database);
}));

router.delete('/databases/:id', asyncHandler(async (req, res) => {
  await DatabaseType.findByIdAndDelete(req.params.id);
  res.status(204).end();
}));

// --- Master Project Management ---

router.get('/projects', asyncHandler(async (req, res) => {
  const projects = await Project.find()
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });
  res.json(projects);
}));

// --- System Settings ---

router.get('/settings/ingest-url', asyncHandler(async (req, res) => {
  const config = await SystemConfig.findOne({ key: 'ingest_url' });
  res.json({ value: config ? config.value : 'http://localhost:3001' });
}));

router.post('/settings/ingest-url', asyncHandler(async (req, res) => {
  const { value } = req.body;
  const config = await SystemConfig.findOneAndUpdate(
    { key: 'ingest_url' },
    { value, updatedAt: Date.now() },
    { upsert: true, new: true }
  );
  res.json(config);
}));

export default router;
