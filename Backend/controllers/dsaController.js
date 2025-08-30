import DsaQuestion from '../models/DsaQuestion.js';
import CodeEvaluationService from '../services/CodeEvaluationService.js';
import Evaluation from '../models/Evaluation.js';

export const getDsaProblems = async (req, res) => {
  try {
    const { topic, difficulty, page = 1, limit = 10 } = req.query;
    
    const filter = {};
    if (topic) filter.topic = topic;
    if (difficulty) filter.difficulty = difficulty;

    const problems = await DsaQuestion.find(filter)
      .select('-testCases -solution')
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await DsaQuestion.countDocuments(filter);

    res.json({
      success: true,
      problems,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getDsaProblem = async (req, res) => {
  try {
    const { problemId } = req.params;

    const problem = await DsaQuestion.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    res.json({
      success: true,
      problem: {
        id: problem._id,
        title: problem.title,
        description: problem.description,
        topic: problem.topic,
        difficulty: problem.difficulty,
        functionName: problem.functionName,
        constraints: problem.constraints,
        examples: problem.examples
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const evaluateSolution = async (req, res) => {
  try {
    const { problemId, code, language } = req.body;
    const userId = req.user.id;

    const problem = await DsaQuestion.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    // Evaluate the code
    const evaluation = await CodeEvaluationService.evaluateCode({
      code,
      language: language || 'javascript',
      functionName: problem.functionName,
      testCases: problem.testCases,
      timeLimit: problem.timeLimit,
      memoryLimit: problem.memoryLimit
    });

    // Save evaluation result
    const evaluationRecord = await Evaluation.create({
      userId,
      problemId,
      code,
      language,
      result: evaluation,
      score: evaluation.overallScore
    });

    res.json({
      success: true,
      evaluation,
      evaluationId: evaluationRecord._id
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getSolutionHistory = async (req, res) => {
  try {
    const { problemId } = req.params;
    const userId = req.user.id;
    const { page = 1, limit = 10 } = req.query;

    const history = await Evaluation.find({ userId, problemId })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('problemId', 'title topic difficulty');

    const total = await Evaluation.countDocuments({ userId, problemId });

    res.json({
      success: true,
      history,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};