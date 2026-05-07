import { PlatformType, DatabaseType } from '../../system-config/models/system-config.model.js';
import { asyncHandler } from '../../../common/utils/asyncHandler.js';

// --- Database Types ---
export const getDatabaseTypes = asyncHandler(async (req, res) => {
  const types = await DatabaseType.find();
  res.json(types);
});

export const createDatabaseType = asyncHandler(async (req, res) => {
  const type = await DatabaseType.create(req.body);
  res.status(201).json(type);
});

export const updateDatabaseType = asyncHandler(async (req, res) => {
  const type = await DatabaseType.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(type);
});

export const deleteDatabaseType = asyncHandler(async (req, res) => {
  await DatabaseType.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

// --- Platform Types ---
export const getPlatformTypes = asyncHandler(async (req, res) => {
  const types = await PlatformType.find();
  res.json(types);
});

export const createPlatformType = asyncHandler(async (req, res) => {
  const type = await PlatformType.create(req.body);
  res.status(201).json(type);
});

export const updatePlatformType = asyncHandler(async (req, res) => {
  const type = await PlatformType.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(type);
});

export const deletePlatformType = asyncHandler(async (req, res) => {
  await PlatformType.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});
