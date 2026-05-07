import { Router } from 'express';
import * as authController from './controllers/auth.controller.js';
import { Project } from '../projects/models/project.model.js';
import { asyncHandler } from '../../common/utils/asyncHandler.js';
import { ApiError } from '../../common/middleware/error.middleware.js';

const router = Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

// Endpoint xác thực API Key cho SDK
router.get('/verify', asyncHandler(async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  if (!apiKey) throw new ApiError('Missing API Key', 401);

  const project = await Project.findOne({ apiKey });
  if (!project) throw new ApiError('Invalid API Key', 403);

  res.json({ status: 'ok', project: project.name });
}));

export default router;
