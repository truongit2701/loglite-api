import { Log } from './models/log.model.js';

class LogWorker {
  constructor() {
    this.queue = [];
    this.isProcessing = false;
    this.BATCH_SIZE = 100;
    this.INTERVAL = 3000;
  }

  /**
   * Thêm log vào queue tập trung
   */
  async addToQueue(logs) {
    this.queue.push(...logs);
    if (this.queue.length >= this.BATCH_SIZE) {
      this.processQueue();
    }
  }

  async processQueue() {
    if (this.isProcessing || this.queue.length === 0) return;
    
    this.isProcessing = true;
    const batch = [...this.queue];
    this.queue = [];

    try {
      await Log.insertMany(batch);
      console.log(`📡 LogWorker: Flushed ${batch.length} logs to centralized storage.`);
    } catch (err) {
      console.error(`❌ LogWorker: Failed to flush logs:`, err.message);
    } finally {
      this.isProcessing = false;
    }
  }

  start() {
    setInterval(() => this.processQueue(), this.INTERVAL);
    console.log('🚀 LogWorker: Centralized ingestion cycle started');
  }
}

export const logWorker = new LogWorker();
