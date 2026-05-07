import mongoose from 'mongoose';
import config from '../../config/config.js';

/**
 * Kết nối tới MongoDB tập trung của LogLite
 */
export const connectDatabase = async () => {
  try {
    const options = {
      autoIndex: true, // Tự động tạo index (Senior Tip: Nên tắt ở Prod cực lớn, nhưng ở đây bật để tiện)
      maxPoolSize: 10,
    };

    console.log('🔌 Attempting to connect to MongoDB...');
    await mongoose.connect(config.mongoUri, options);
    
    console.log('✅ MongoDB Connected Successfully');
  } catch (error) {
    console.error('❌ MongoDB Connection Error:', error.message);
    process.exit(1); // Dừng server nếu không kết nối được DB
  }
};

// Theo dõi trạng thái kết nối
mongoose.connection.on('disconnected', () => {
  console.warn('⚠️ MongoDB disconnected. Retrying...');
});

mongoose.connection.on('error', (err) => {
  console.error('❌ MongoDB Error:', err);
});
