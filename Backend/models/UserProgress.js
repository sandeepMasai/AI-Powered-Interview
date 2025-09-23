import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  interviewStats: {
    totalSessions: { type: Number, default: 0 },
    completedSessions: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    totalTimeSpent: { type: Number, default: 0 }, 
    byTopic: {
      type: Map,
      of: {
        totalSessions: Number,
        completedSessions: Number,
        averageScore: Number,
        totalTimeSpent: Number
      },
      default: {}
    }
  },
  dsaStats: {
    totalProblemsAttempted: { type: Number, default: 0 },
    totalProblemsSolved: { type: Number, default: 0 },
    averageScore: { type: Number, default: 0 },
    byTopic: {
      type: Map,
      of: {
        attempted: Number,
        solved: Number,
        averageScore: Number
      },
      default: {}
    },
    byDifficulty: {
      easy: { attempted: Number, solved: Number, averageScore: Number },
      medium: { attempted: Number, solved: Number, averageScore: Number },
      hard: { attempted: Number, solved: Number, averageScore: Number }
    }
  },
  weakAreas: [{
    topic: String,
    subTopic: String,
    score: Number,
    occurrences: Number,
    lastPracticed: Date
  }],
  strongAreas: [{
    topic: String,
    subTopic: String,
    score: Number,
    confidence: Number
  }],
  learningPath: [{
    topic: String,
    priority: { type: Number, min: 1, max: 5 },
    targetScore: Number,
    resources: [String],
    deadline: Date,
    completed: { type: Boolean, default: false }
  }],
  achievements: [{
    name: String,
    description: String,
    icon: String,
    earnedAt: { type: Date, default: Date.now },
    criteria: Map
  }],
  streak: {
    current: { type: Number, default: 0 },
    longest: { type: Number, default: 0 },
    lastPractice: Date
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Update streak when user practices
progressSchema.methods.updateStreak = function() {
  const today = new Date().toDateString();
  const lastPracticeDate = this.streak.lastPractice
    ? new Date(this.streak.lastPractice).toDateString()
    : null;

  if (lastPracticeDate === today) {
    return;
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toDateString();

  if (lastPracticeDate === yesterdayStr) {
    // Consecutive day
    this.streak.current += 1;
  } else if (!lastPracticeDate || lastPracticeDate < yesterdayStr) {
    // Broken streak or first time
    this.streak.current = 1;
  }

  this.streak.longest = Math.max(this.streak.longest, this.streak.current);
  this.streak.lastPractice = new Date();
};

// Update topic statistics
progressSchema.methods.updateTopicStats = function(topic, score, timeSpent = 0) {
  const topicStats = this.interviewStats.byTopic.get(topic) || {
    totalSessions: 0,
    completedSessions: 0,
    averageScore: 0,
    totalTimeSpent: 0
  };

  topicStats.totalSessions += 1;
  topicStats.completedSessions += score != null ? 1 : 0;
  topicStats.totalTimeSpent += timeSpent;

  if (score != null) {
    const totalScore = topicStats.averageScore * (topicStats.completedSessions - 1) + score;
    topicStats.averageScore = totalScore / topicStats.completedSessions;
  }

  this.interviewStats.byTopic.set(topic, topicStats);

  // Update overall stats
  this.interviewStats.totalSessions += 1;
  this.interviewStats.completedSessions += score != null ? 1 : 0;
  this.interviewStats.totalTimeSpent += timeSpent;

  if (score != null) {
    const totalScore = this.interviewStats.averageScore * (this.interviewStats.completedSessions - 1) + score;
    this.interviewStats.averageScore = totalScore / this.interviewStats.completedSessions;
  }
};

// Update weak/strong areas
progressSchema.methods.updateAreas = function(topic, score, subTopic = null) {
  const areaType = score >= 7 ? 'strongAreas' : 'weakAreas';
  const areas = this[areaType];
  
  let area = areas.find(a => a.topic === topic && a.subTopic === subTopic);
  
  if (!area) {
    area = { topic, subTopic, score: 0, occurrences: 0 };
    areas.push(area);
  }

  const totalScore = area.score * area.occurrences + score;
  area.occurrences += 1;
  area.score = totalScore / area.occurrences;

  if (areaType === 'weakAreas') {
    area.lastPracticed = new Date();
  }

  // Keep only top 10 areas
  this[areaType] = areas
    .sort((a, b) => a.score - b.score)
    .slice(0, 10);
};

export default mongoose.model('UserProgress', progressSchema);