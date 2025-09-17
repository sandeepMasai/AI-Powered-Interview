
import express from 'express';
import { createQuestion, getQuestions } from '../controllers/questionController.js';

const router = express.Router();

router
  .route('/')
  .post(createQuestion)   // POST /api/questions
  .get(getQuestions);     // GET /api/questions?topic=nodejs&difficulty=medium

export default router;
