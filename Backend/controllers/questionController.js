
import Question from '../models/Question.js';

// Create a new question
export const createQuestion = async (req, res) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json({ success: true, data: question });
  } catch (error) {
    console.error('Validation Error:', error);
    res.status(400).json({ success: false, error: error.message });
  }
};

//  Get random questions by topic and difficulty

export const getQuestions = async (req, res) => {
  const { topic, difficulty, limit = 10 } = req.query;

  try {
    const questions = await Question.getRandomQuestions(topic, difficulty, parseInt(limit));
    res.status(200).json({ success: true, data: questions });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};


