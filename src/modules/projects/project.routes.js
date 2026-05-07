import { Router } from 'express';
import * as projectController from './controllers/project.controller.js';

const router = Router();

router.get('/', projectController.getProjects);
router.post('/', projectController.createProject);
router.put('/:id', projectController.updateProject);

export default router;
