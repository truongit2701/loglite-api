import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const env = process.env.NODE_ENV || 'local';
const configPath = path.resolve(__dirname, `./${env}.json`);

let config = {};

try {
  const fileContent = fs.readFileSync(configPath, 'utf8');
  config = JSON.parse(fileContent);
} catch (error) {
  config = {
    port: parseInt(process.env.PORT || '3001'),
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/loglite',
    jwtSecret: process.env.JWT_SECRET || 'loglite-super-secret',
    logLevel: 'info'
  };
}

export default config;
