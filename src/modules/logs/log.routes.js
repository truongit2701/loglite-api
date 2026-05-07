import { Router } from 'express';
import * as logController from './controllers/log.controller.js';

const router = Router();

// Senior Tip: This router is mounted at '/logs' in app.js.
// SDK calls: POST /logs (ingest)
router.post('/', logController.ingestLogs);

// Dashboard calls: GET /logs (query)
router.get('/', logController.getLogs);

// Stats logic is moved to app.js for global access
// but can also be accessed via /logs/stats if needed.
router.get('/summary', logController.getStats);

export default router;
