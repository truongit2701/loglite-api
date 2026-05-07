import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV || 'local';
const configPath = path.resolve(__dirname, `./${env}.json`);

let fileConfig = {};

// 1. Đọc cấu hình từ file JSON (nếu có)
try {
  if (fs.existsSync(configPath)) {
    const fileContent = fs.readFileSync(configPath, 'utf8');
    fileConfig = JSON.parse(fileContent);
  }
} catch (error) {
  console.warn(`⚠️ Could not load config file: ${configPath}. Using defaults.`);
}

// 2. Kết hợp với biến môi trường (Biến môi trường luôn có quyền ưu tiên cao nhất)
const config = {
  port: parseInt(process.env.PORT || fileConfig.port || '3001'),
  mongoUri: process.env.MONGO_URI || fileConfig.mongoUri || 'mongodb://localhost:27017/loglite',
  jwtSecret: process.env.JWT_SECRET || fileConfig.jwtSecret || 'loglite-super-secret',
  logLevel: process.env.LOG_LEVEL || fileConfig.logLevel || 'info'
};

export default config;
