import mongoose from 'mongoose';

const testCaseSchema = new mongoose.Schema({
  input: {
    type: String,
    required: [true, 'Please add input for test case']
  },
  expectedOutput: {
    type: String,
    required: [true, 'Please add expected output']
  },
  explanation: String,
  isPublic: {
    type: Boolean,
    default: false
  }
});

const dsaQuestionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  topic: {
    type: String,
    required: [true, 'Please add a topic'],
    enum: [
      'arrays', 'strings', 'linked-lists', 'trees', 'graphs',
      'dynamic-programming', 'sorting', 'searching', 'recursion',
      'backtracking', 'greedy', 'divide-conquer', 'bit-manipulation',
      'math', 'geometry', 'databases', 'concurrency'
    ]
  },
  difficulty: {
    type: String,
    enum: ['easy', 'medium', 'hard'],
    default: 'medium'
  },
  functionName: {
    type: String,
    required: [true, 'Please add function name'],
    trim: true
  },
  constraints: [{
    type: String,
    required: [true, 'Please add constraints']
  }],
  examples: [{
    input: String,
    output: String,
    explanation: String
  }],
  testCases: [testCaseSchema],
  solution: {
    type: String,
    maxlength: [5000, 'Solution cannot be more than 5000 characters']
  },
  timeComplexity: String,
  spaceComplexity: String,
  hints: [String],
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

// Index for better query performance
dsaQuestionSchema.index({ topic: 1, difficulty: 1 });
dsaQuestionSchema.index({ isActive: 1, topic: 1 });

// Static method to get problems by filters
dsaQuestionSchema.statics.getProblems = function(filters = {}, page = 1, limit = 10) {
  const skip = (page - 1) * limit;
  
  return this.find({ ...filters, isActive: true })
    .select('-testCases -solution')
    .skip(skip)
    .limit(limit)
    .sort({ difficulty: 1, title: 1 });
};

export default mongoose.model('DsaQuestion', dsaQuestionSchema);