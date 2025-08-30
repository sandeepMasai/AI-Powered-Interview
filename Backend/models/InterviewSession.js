import mongoose from 'mongoose';

const questionResponseSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.ObjectId,
    ref: 'Question',
    required: true
  },
  question: {
    type: String,
    required: true
  },
  expectedPoints: [String],
  userAnswer: {
    type: String,
    maxlength: [2000, 'Answer cannot be more than 2000 characters']
  },
  score: {
    type: Number,
    min: 0,
    max: 10
  },
  feedback: String,
  missedPoints: [String],
  timeTaken: Number, // in seconds
  evaluatedAt: Date
});

const interviewSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  topic: {
    type: String,
    required: [true, 'Please add a topic'],
    enum: ['react', 'javascript', 'nodejs', 'mongodb', 'html', 'css', 'system-design']
  },
  duration: {
    type: Number,
    required: [true, 'Please add duration'],
    enum: [15, 30, 45, 60]
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  questions: [questionResponseSchema],
  status: {
    type: String,
    enum: ['in-progress', 'completed', 'abandoned'],
    default: 'in-progress'
  },
  score: {
    type: Number,
    min: 0,
    max: 10
  },
  startedAt: {
    type: Date,
    default: Date.now
  },
  completedAt: Date,
  timeSpent: Number, // in minutes
  notes: String
}, {
  timestamps: true
});

// Index for better query performance
interviewSessionSchema.index({ userId: 1, status: 1 });
interviewSessionSchema.index({ userId: 1, createdAt: -1 });

// Calculate time spent when session is completed
interviewSessionSchema.pre('save', function(next) {
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = Date.now();
    this.timeSpent = Math.round((this.completedAt - this.startedAt) / 60000); // minutes
  }
  next();
});

// Instance method to calculate overall score
interviewSessionSchema.methods.calculateScore = function() {
  const answeredQuestions = this.questions.filter(q => q.score != null);
  if (answeredQuestions.length === 0) return 0;

  const totalScore = answeredQuestions.reduce((sum, q) => sum + q.score, 0);
  return parseFloat((totalScore / answeredQuestions.length).toFixed(2));
};

// Static method to get user session statistics
interviewSessionSchema.statics.getUserStats = function(userId) {
  return this.aggregate([
    { $match: { userId: userId, status: 'completed' } },
    {
      $group: {
        _id: '$topic',
        totalSessions: { $sum: 1 },
        averageScore: { $avg: '$score' },
        totalTimeSpent: { $sum: '$timeSpent' }
      }
    }
  ]);
};

export default mongoose.model('InterviewSession', interviewSessionSchema);