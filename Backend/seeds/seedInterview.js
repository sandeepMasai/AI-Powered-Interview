import mongoose from 'mongoose';
import Question from '../models/Question.js';
import questions from './interviewQuestions.json' assert { type: 'json' };
import dotenv from 'dotenv';

dotenv.config();

const seedInterviewQuestions = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing questions
    await Question.deleteMany({});
    console.log('Cleared existing questions');

    // Insert new questions
    await Question.insertMany(questions);
    console.log('Interview questions seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding interview questions:', error);
    process.exit(1);
  }
};

seedInterviewQuestions();