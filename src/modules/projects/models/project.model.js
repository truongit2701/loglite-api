import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  apiKey: { type: String, required: true, unique: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  platformType: { type: String, default: 'node' },
  databaseType: { type: String, default: 'mongodb' },
  ingestUrl: { type: String },
  createdAt: { type: Date, default: Date.now }
});

export const Project = mongoose.model('Project', ProjectSchema);
