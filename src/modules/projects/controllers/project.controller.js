import crypto from 'crypto';
import { Project } from '../models/project.model.js';
import { SystemConfig } from '../../system-config/models/system-config.model.js';
import { asyncHandler } from '../../../common/utils/asyncHandler.js';
import { ApiError } from '../../../common/middleware/error.middleware.js';

export const getProjects = asyncHandler(async (req, res) => {
  const query = req.user?.role === 'admin' ? {} : { owner: req.user?.id };
  // Senior Tip: We no longer populate 'dbType' because it's now 'databaseType' (String)
  const projects = await Project.find(query).sort({ createdAt: -1 });
  res.json(projects);
});

export const createProject = asyncHandler(async (req, res) => {
  const { name, platformType = 'node', databaseType = 'mongodb' } = req.body;

  if (!name) throw new ApiError('Project name is required', 400);

  // Fetch current ingest URL from system config
  const config = await SystemConfig.findOne({ key: 'ingest_url' });
  const ingestUrl = config ? config.value : 'http://localhost:3001';

  const apiKey = `ll_${crypto.randomBytes(16).toString('hex')}`;
  
  const project = await Project.create({
    name,
    apiKey,
    ingestUrl,
    owner: req.user?.id,
    platformType,
    databaseType,
    createdAt: new Date()
  });

  res.status(201).json(project);
});

export const updateProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name, platformType, databaseType } = req.body;

  const project = await Project.findOne({ _id: id, owner: req.user?.id });
  if (!project) throw new ApiError('Project not found', 404);

  if (name) project.name = name;
  if (platformType) project.platformType = platformType;
  if (databaseType) project.databaseType = databaseType;

  await project.save();
  res.json(project);
});
