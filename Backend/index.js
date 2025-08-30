// import express from 'express';
// import connectDB from './config/database.js'; 
// import dotenv from 'dotenv';

// dotenv.config()
// const app = express();
// const PORT = process.env.PORT;

// // Connect to MongoDB
// connectDB();

// // Middleware
// app.use(express.json());

// // Routes
// app.get('/', (req, res) => {
//   res.send('Hello from Express server!');
// });

// // Start Server
// app.listen(PORT, () => {
//   console.log(` Server is running on http://localhost:${PORT}`);
// });

import express from 'express';
import cors from 'cors';
import connectDB from './config/database.js';

import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Routes
import authRoutes from './routes/auth.js';
import interviewRoutes from './routes/interview.js';
import dsaRoutes from './routes/dsa.js';
import progressRoutes from './routes/progress.js';

// Middleware
import errorHandler from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
connectDB();

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

// Middleware
app.use(limiter);
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/interview', interviewRoutes);
app.use('/api/dsa', dsaRoutes);
app.use('/api/progress', progressRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling
app.use(errorHandler);



app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});