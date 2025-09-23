import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: [true, 'Please add a topic'],
    enum: ['react', 'javascript', 'nodejs', 'mongodb', 'html', 'css', 'system-design','backend']
  },
  question: {
    type: String,
    required: [true, 'Please add a question'],
    trim: true,
    maxlength: [500, 'Question cannot be more than 500 characters']
  },
  description: {
    type: String,
    maxlength: [1000, 'Description cannot be more than 1000 characters']
  },
  expectedPoints: [{
    type: String,
    required: [true, 'Please add expected points']
  }],
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  tags: [String],
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  hints: [String],
  category: {
    type: String,
    enum: ['conceptual', 'practical', 'behavioral', 'problem-solving'],
    default: 'conceptual'
  },
  timeLimit: {
    type: Number,
    default: 5,
    min: 1,
    max: 15
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
questionSchema.index({ topic: 1, difficulty: 1 });
questionSchema.index({ isActive: 1, topic: 1 });

// Static method to get random questions
questionSchema.statics.getRandomQuestions = function(topic, difficulty, limit = 10) {
  return this.aggregate([
    { $match: { topic, difficulty, isActive: true } },
    { $sample: { size: limit } }
  ]);
};

export default mongoose.model('Question', questionSchema);