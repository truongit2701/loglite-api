import { Router } from 'express';
import { PlatformType, DatabaseType } from './models/system-config.model.js';
import { asyncHandler } from '../../common/utils/asyncHandler.js';

const router = Router();

router.get('/platform-types', asyncHandler(async (req, res) => {
  const types = await PlatformType.find();
  res.json(types);
}));

router.get('/db-types', asyncHandler(async (req, res) => {
  const types = await DatabaseType.find();
  res.json(types);
}));

export default router;
