import mongoose from 'mongoose';

const LogSchema = new mongoose.Schema({
  projectId: { type: String, required: true, index: true },
  level: { type: String, required: true, index: true },
  message: { type: String, required: true },
  service: { type: String, index: true },
  env: { type: String },
  timestamp: { type: Number, default: Date.now, index: true },
  meta: mongoose.Schema.Types.Mixed
});

// Senior Tip: Sử dụng TTL Index nếu bạn muốn log tự xóa sau N ngày (ví dụ 30 ngày)
// LogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 2592000 });

export const Log = mongoose.model('Log', LogSchema);
