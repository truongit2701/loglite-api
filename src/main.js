import createApp from './app.js';
import config from './config/config.js';
import { connectDatabase } from './infrastructure/database/mongoose.js';
import { logWorker } from './modules/logs/log.worker.js';

// Helper function để quét và in toàn bộ routes (Senior Debugging)
const printRoutes = (app) => {
  console.log('\n📍 REGISTERED ROUTES:');
  console.log('============================================');
  const routes = [];
  
  app._router.stack.forEach((middleware) => {
    if (middleware.route) {
      const path = middleware.route.path;
      const methods = Object.keys(middleware.route.methods).join(', ').toUpperCase();
      routes.push({ methods, path });
    } else if (middleware.name === 'router') {
      middleware.handle.stack.forEach((handler) => {
        if (handler.route) {
          const path = middleware.regexp.toString()
            .replace('/^\\', '')
            .replace('\\/?(?=\\/|$)/i', '')
            .replace(/\\\//g, '/') + handler.route.path;
          const methods = Object.keys(handler.route.methods).join(', ').toUpperCase();
          routes.push({ methods, path });
        }
      });
    }
  });

  if (routes.length > 0) {
    console.table(routes.sort((a, b) => a.path.localeCompare(b.path)));
  } else {
    console.log('No routes found.');
  }
  console.log('============================================\n');
};

const bootstrap = async () => {
  try {
    // 1. Connect to Infrastructure
    await connectDatabase();

    // 2. Initialize Application
    const app = createApp();

    // 3. Print Routes for Debugging
    printRoutes(app);

    // 4. Start Background Workers
    logWorker.start();

    // 5. Start Server
    app.listen(config.port, () => {
      console.log(`
    🚀 LOGLITE SERVER STARTED (SENIOR MODULAR JS)
    ============================================
    PORT: ${config.port}
    ENV:  ${process.env.NODE_ENV || 'local'}
    ============================================
    `);
    });
  } catch (error) {
    console.error('❌ FATAL STARTUP ERROR:', error);
    process.exit(1);
  }
};

bootstrap();
