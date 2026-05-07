import { LogService } from '../services/log.service.js';
import { Project } from '../../projects/models/project.model.js';
import { logWorker } from '../log.worker.js';
import { asyncHandler } from '../../../common/utils/asyncHandler.js';
import { ApiError } from '../../../common/middleware/error.middleware.js';

/**
 * Ingest logs from SDK
 * PUBLIC - Uses API Key in Header
 */
export const ingestLogs = asyncHandler(async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const logs = req.body;

  if (!apiKey) throw new ApiError('API Key is required', 401);
  if (!Array.isArray(logs)) throw new ApiError('Logs must be an array', 400);

  const project = await Project.findOne({ apiKey });
  if (!project) throw new ApiError('Invalid API Key', 403);

  const logsWithProject = logs.map(l => ({
    ...l, 
    projectId: project.apiKey, // Keeping internal storage as apiKey for performance
    timestamp: l.timestamp || Date.now()
  }));
  
  await logWorker.addToQueue(logsWithProject);

  res.status(202).json({ status: 'accepted', count: logs.length });
});

/**
 * Query logs for Dashboard
 * PRIVATE - Uses Project ID (_id) and JWT
 */
export const getLogs = asyncHandler(async (req, res) => {
  const { projectId } = req.query; // This is now the MongoDB _id
  if (!projectId) throw new ApiError('Project ID is required', 400);

  // Verify ownership
  const project = await Project.findOne({ 
    _id: projectId,
  });
  
  if (!project) throw new ApiError('Access denied or project not found', 403);

  // We query the logs using the internal apiKey reference
  const result = await LogService.queryLogs(project.apiKey, req.query);
  res.json(result);
});

/**
 * Get project stats
 */
export const getStats = asyncHandler(async (req, res) => {
  const { projectId } = req.query;
  if (!projectId) throw new ApiError('Project ID is required', 400);

  const project = await Project.findOne({ 
    _id: projectId,
  });

  if (!project) throw new ApiError('Project not found', 404);

  const stats = await LogService.getStats(project.apiKey);
  res.json(stats);
});
