import mongoose from 'mongoose';

// 1. Quản lý các loại Platform (Node.js, React, v.v.)
const platformTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  description: String
});

// 2. Quản lý các loại Database (MongoDB, PostgreSQL, v.v.)
const databaseTypeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  description: String
});

// 3. Quản lý cấu hình hệ thống chung (Ingest URL, v.v.)
const systemConfigSchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed, required: true },
  description: String,
  updatedAt: { type: Date, default: Date.now }
});

export const PlatformType = mongoose.model('PlatformType', platformTypeSchema);
export const DatabaseType = mongoose.model('DatabaseType', databaseTypeSchema);
export const SystemConfig = mongoose.model('SystemConfig', systemConfigSchema);

// Helper để lấy Ingest URL
export const getIngestUrl = async () => {
  const config = await SystemConfig.findOne({ key: 'ingest_url' });
  return config ? config.value : 'http://localhost:3001';
};
