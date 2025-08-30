import express from 'express';
import {
  startInterview,
  submitAnswer,
  completeInterview,
  getSession,
  getSessionHistory
} from '../controllers/interviewController.js';
import { authenticate } from '../middleware/auth.js';
import { validateInterviewStart } from '../middleware/validation.js';

const router = express.Router();

router.use(authenticate);

router.post('/start', validateInterviewStart, startInterview);
router.post('/submit-answer', submitAnswer);
router.post('/complete', completeInterview);
router.get('/session/:sessionId', getSession);
router.get('/history', getSessionHistory);

export default router;