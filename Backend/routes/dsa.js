import express from 'express';
import {
  getDsaProblems,
  getDsaProblem,
  evaluateSolution,
  getSolutionHistory
} from '../controllers/dsaController.js';
import { authenticate } from '../middleware/auth.js';
import { validateDsaSolution } from '../middleware/validation.js';

const router = express.Router();

router.use(authenticate);

router.get('/problems', getDsaProblems);
router.get('/problems/:problemId', getDsaProblem);
router.post('/evaluate', validateDsaSolution, evaluateSolution);
router.get('/history/:problemId', getSolutionHistory);

export default router;