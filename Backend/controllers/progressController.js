import User from '../models/User.js';
import InterviewSession from '../models/InterviewSession.js';
import Evaluation from '../models/Evaluation.js';
import Question from '../models/Question.js'
import DsaQuestion from '../models/DsaQuestion.js'

export const getDashboard = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    const recentSessions = await InterviewSession.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);
    
    const recentEvaluations = await Evaluation.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('problemId', 'title topic difficulty');

    const sessionStats = await InterviewSession.aggregate([
      { $match: { userId: userId, status: 'completed' } },
      {
        $group: {
          _id: '$topic',
          totalSessions: { $sum: 1 },
          averageScore: { $avg: '$score' }
        }
      }
    ]);

    const dsaStats = await Evaluation.aggregate([
      { $match: { userId: userId } },
      {
        $lookup: {
          from: 'dsaquestions',
          localField: 'problemId',
          foreignField: '_id',
          as: 'problem'
        }
      },
      { $unwind: '$problem' },
      {
        $group: {
          _id: '$problem.topic',
          totalProblems: { $sum: 1 },
          averageScore: { $avg: '$score' }
        }
      }
    ]);

    res.json({
      success: true,
      dashboard: {
        userProgress: user.progress,
        recentSessions,
        recentEvaluations,
        sessionStats,
        dsaStats,
        weakAreas: user.progress.weakAreas || []
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getProgressHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { days = 30 } = req.query;

    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    // Interview session progress
    const sessionProgress = await InterviewSession.aggregate([
      {
        $match: {
          userId: userId,
          status: 'completed',
          completedAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$completedAt' }
          },
          averageScore: { $avg: '$score' },
          sessionCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    // DSA progress
    const dsaProgress = await Evaluation.aggregate([
      {
        $match: {
          userId: userId,
          createdAt: { $gte: startDate }
        }
      },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$createdAt' }
          },
          averageScore: { $avg: '$score' },
          submissionCount: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json({
      success: true,
      progress: {
        sessionProgress,
        dsaProgress,
        timeRange: {
          start: startDate,
          end: new Date()
        }
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getWeakAreas = async (req, res) => {
  try {
    const userId = req.user.id;

    // Get weak areas from interview sessions
    const interviewWeakAreas = await InterviewSession.aggregate([
      { $match: { userId: userId, status: 'completed' } },
      { $unwind: '$questions' },
      { $match: { 'questions.score': { $lt: 7 } } },
      { $unwind: '$questions.missedPoints' },
      {
        $group: {
          _id: '$questions.missedPoints',
          count: { $sum: 1 },
          averageScore: { $avg: '$questions.score' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Get weak areas from DSA
    const dsaWeakAreas = await Evaluation.aggregate([
      { $match: { userId: userId, score: { $lt: 70 } } },
      {
        $lookup: {
          from: 'dsaquestions',
          localField: 'problemId',
          foreignField: '_id',
          as: 'problem'
        }
      },
      { $unwind: '$problem' },
      {
        $group: {
          _id: '$problem.topic',
          count: { $sum: 1 },
          averageScore: { $avg: '$score' }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    res.json({
      success: true,
      weakAreas: {
        interview: interviewWeakAreas,
        dsa: dsaWeakAreas
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getRecommendations = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    const weakAreas = user.progress.weakAreas || [];
    const recommendations = [];

    // Generate recommendations based on weak areas
    if (weakAreas.length > 0) {
      const relatedQuestions = await Question.find({
        topic: { $in: weakAreas.slice(0, 3) },
        difficulty: 'easy'
      }).limit(5);

      const relatedProblems = await DsaQuestion.find({
        topic: { $in: weakAreas.slice(0, 3) },
        difficulty: 'easy'
      }).limit(5);

      recommendations.push(
        ...relatedQuestions.map(q => ({
          type: 'interview',
          title: `Practice: ${q.topic}`,
          description: `Work on ${q.topic} questions to improve your skills`,
          resource: q
        })),
        ...relatedProblems.map(p => ({
          type: 'dsa',
          title: `Practice: ${p.topic}`,
          description: `Solve ${p.topic} problems to strengthen your understanding`,
          resource: p
        }))
      );
    }

    // Add general recommendations if needed
    if (recommendations.length < 5) {
      const generalQuestions = await Question.aggregate([
        { $sample: { size: 5 - recommendations.length } }
      ]);

      recommendations.push(
        ...generalQuestions.map(q => ({
          type: 'interview',
          title: `General Practice: ${q.topic}`,
          description: `Try some ${q.topic} questions to broaden your knowledge`,
          resource: q
        }))
      );
    }

    res.json({
      success: true,
      recommendations
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};