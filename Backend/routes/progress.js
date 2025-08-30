import express from 'express';
import {
  getDashboard,
  getProgressHistory,
  getWeakAreas,
  getRecommendations
} from '../controllers/progressController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/dashboard', getDashboard);
router.get('/history', getProgressHistory);
router.get('/weak-areas', getWeakAreas);
router.get('/recommendations', getRecommendations);

export default router;