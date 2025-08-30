import { body, validationResult } from 'express-validator';

export const validateRegistration = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Name must be between 2 and 50 characters'),
  
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const validateInterviewStart = [
  body('topic')
    .notEmpty()
    .withMessage('Topic is required')
    .isIn(['react', 'javascript', 'nodejs', 'mongodb', 'html', 'css'])
    .withMessage('Invalid topic'),
  
  body('duration')
    .isInt({ min: 5, max: 60 })
    .withMessage('Duration must be between 5 and 60 minutes'),
  
  body('difficulty')
    .optional()
    .isIn(['easy', 'medium', 'hard'])
    .withMessage('Invalid difficulty level'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

export const validateDsaSolution = [
  body('problemId')
    .notEmpty()
    .withMessage('Problem ID is required')
    .isMongoId()
    .withMessage('Invalid problem ID'),
  
  body('code')
    .notEmpty()
    .withMessage('Code is required')
    .isLength({ max: 10000 })
    .withMessage('Code must be less than 10000 characters'),
  
  body('language')
    .optional()
    .isIn(['javascript', 'python', 'java', 'c++', 'c'])
    .withMessage('Unsupported language'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];