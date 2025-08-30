import mongoose from 'mongoose';
import DsaQuestion from '../models/DsaQuestion.js';
import dsaQuestions from './dsaQuestions.json' assert { type: 'json' };
import dotenv from 'dotenv';

dotenv.config();

const seedDsaQuestions = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing questions
    await DsaQuestion.deleteMany({});
    console.log('Cleared existing DSA questions');

    // Insert new questions
    await DsaQuestion.insertMany(dsaQuestions);
    console.log('DSA questions seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding DSA questions:', error);
    process.exit(1);
  }
};

seedDsaQuestions();