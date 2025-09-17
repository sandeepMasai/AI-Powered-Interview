import InterviewSession from '../models/InterviewSession.js';
import Question from '../models/Question.js';
import AIEvaluationService from '../services/AIEvaluationService.js';
import User from '../models/User.js';

export const startInterview = async (req, res) => {
  try {
    const { topic, duration, difficulty } = req.body;
    const userId = req.user.id;

    // Get random questions based on topic and difficulty
    const questions = await Question.aggregate([
      { $match: { topic, difficulty: difficulty || 'medium' } },
      { $sample: { size: duration === 30 ? 10 : duration === 60 ? 20 : 5 } }
    ]);

    if (questions.length === 0) {
      return res.status(404).json({ message: 'No questions found for this topic' });
    }

    // Create interview session
    const session = await InterviewSession.create({
      userId,
      topic,
      duration,
      difficulty,
      questions: questions.map(q => ({
        questionId: q._id,
        question: q.question,
        expectedPoints: q.expectedPoints
      })),
      status: 'in-progress'
    });

    res.json({
      success: true,
      sessionId: session._id,
      questions: session.questions,
      duration: session.duration
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const submitAnswer = async (req, res) => {
  try {
    const { sessionId, questionId, answer } = req.body;
    const userId = req.user.id;

    const session = await InterviewSession.findOne({ _id: sessionId, userId });
    if (!session) return res.status(404).json({ message: 'Session not found' });

    const question = session.questions.id(questionId);
    if (!question) return res.status(404).json({ message: 'Question not found' });

    // Evaluate answer
    const evaluation = await AIEvaluationService.evaluateAnswer({
      question: question.question,
      userAnswer: answer,
      expectedPoints: question.expectedPoints,
      topic: session.topic
    });

    // Ensure score is a valid number
    const safeScore = Number(evaluation.score);
    question.userAnswer = answer;
    question.score = isNaN(safeScore) ? 0 : safeScore;
    question.feedback = evaluation.feedback || '';
    question.missedPoints = evaluation.missedPoints || [];
    question.evaluatedAt = new Date();

    await session.save();

    res.json({
      success: true,
      evaluation: {
        ...evaluation,
        score: question.score // send back safe score
      },
      questionId: question._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};



export const getSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    const session = await InterviewSession.findOne({
      _id: sessionId,
      userId
    });

    if (!session) {
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json({
      success: true,
      session
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getSessionHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const sessions = await InterviewSession.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await InterviewSession.countDocuments({ userId });

    res.json({
      success: true,
      sessions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
export const completeInterview = async (req, res) => {
  try {
    const { sessionId } = req.body;
    const session = await InterviewSession.findById(sessionId).populate('questions');

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    // calculate total score
    let totalScore = 0;
    const questions = session.questions.map(q => {
      const questionScore = q.score || 0;
      totalScore += questionScore;

      return {
        _id: q._id,
        question: q.question,
        userAnswer: q.userAnswer,
        score: q.score,
        feedback: q.feedback,
        missedPoints: q.missedPoints || []
      };
    });

    const finalScore = Math.round(totalScore / questions.length);

    session.score = finalScore;
    session.completed = true;
    await session.save();

    res.json({
      score: finalScore,
      questions
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// ✅ Safe weak area calculator
function calculateWeakAreas(questions) {
  const weakAreas = {};

  questions.forEach(q => {
    const score = Number(q.score) || 0;
    if (score < 7 && Array.isArray(q.missedPoints)) {
      q.missedPoints.forEach(point => {
        weakAreas[point] = (weakAreas[point] || 0) + 1;
      });
    }
  });

  return Object.entries(weakAreas)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([area]) => area);
}
