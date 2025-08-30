import mongoose from 'mongoose';

const testResultSchema = new mongoose.Schema({
  testCaseId: mongoose.Schema.ObjectId,
  input: String,
  expectedOutput: String,
  actualOutput: String,
  passed: Boolean,
  executionTime: Number,
  memoryUsage: Number,
  error: String
});

const evaluationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  problemId: {
    type: mongoose.Schema.ObjectId,
    ref: 'DsaQuestion',
    required: true
  },
  code: {
    type: String,
    required: [true, 'Please add code'],
    maxlength: [10000, 'Code cannot be more than 10000 characters']
  },
  language: {
    type: String,
    required: [true, 'Please add language'],
    enum: ['javascript', 'python', 'java', 'c++', 'c', 'typescript']
  },
  result: {
    totalTestCases: Number,
    passedTestCases: Number,
    results: [testResultSchema],
    overallScore: Number,
    feedback: String,
    executionSummary: {
      totalTime: Number,
      totalMemory: Number,
      averageTime: Number,
      averageMemory: Number
    }
  },
  score: {
    type: Number,
    min: 0,
    max: 100
  },
  status: {
    type: String,
    enum: ['success', 'compilation-error', 'runtime-error', 'timeout', 'wrong-answer'],
    default: 'success'
  },
  executionTime: Number,
  memoryUsage: Number,
  complexity: {
    time: String,
    space: String
  },
  isOptimal: {
    type: Boolean,
    default: false
  },
  attempts: {
    type: Number,
    default: 1
  },
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for better query performance
evaluationSchema.index({ userId: 1, problemId: 1 });
evaluationSchema.index({ userId: 1, submittedAt: -1 });
evaluationSchema.index({ problemId: 1, score: -1 });

// Static method to get best submission for a problem
evaluationSchema.statics.getBestSubmission = function(userId, problemId) {
  return this.findOne({ userId, problemId })
    .sort({ score: -1, executionTime: 1 })
    .select('score executionTime memoryUsage submittedAt attempts');
};

// Static method to get user's evaluation statistics
evaluationSchema.statics.getUserStats = function(userId) {
  return this.aggregate([
    { $match: { userId: userId } },
    {
      $group: {
        _id: '$problemId',
        bestScore: { $max: '$score' },
        totalAttempts: { $sum: 1 },
        lastAttempt: { $max: '$submittedAt' }
      }
    },
    {
      $lookup: {
        from: 'dsaquestions',
        localField: '_id',
        foreignField: '_id',
        as: 'problem'
      }
    },
    { $unwind: '$problem' },
    {
      $group: {
        _id: '$problem.topic',
        totalProblems: { $sum: 1 },
        averageScore: { $avg: '$bestScore' },
        totalAttempts: { $sum: '$totalAttempts' }
      }
    }
  ]);
};

// Instance method to check if solution is optimal
evaluationSchema.methods.checkOptimality = function() {
  const optimalThreshold = 95; // 95% score considered optimal
  this.isOptimal = this.score >= optimalThreshold;
  return this.isOptimal;
};

export default mongoose.model('Evaluation', evaluationSchema);