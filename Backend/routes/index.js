import express from 'express';
import authRoutes from './auth.js';
import interviewRoutes from './interview.js';
import dsaRoutes from './dsa.js';
import progressRoutes from './progress.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/interview', interviewRoutes);
router.use('/dsa', dsaRoutes);
router.use('/progress', progressRoutes);

export default router;