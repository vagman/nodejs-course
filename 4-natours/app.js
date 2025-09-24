import morgan from 'morgan';
import express from 'express';
import qs from 'qs';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';

import { fileURLToPath } from 'node:url';
import path from 'node:path';

import AppError from './utils/appError.js';
import globalErrorHandler from './controllers/errorController.js';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';
import reviewRouter from './routes/reviewRoutes.js';

const app = express();

// Base path to project folder
const __dirname = path.dirname(fileURLToPath(import.meta.url));
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// ------------ 1) Middleware Functions -------------
// Serving static files
app.use(express.static(path.join(__dirname, 'public')));

// Set security HTTP headers
app.use(helmet());

// Development Logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

// Set query parser AFTER body parser
app.set('query parser', str => qs.parse(str));

// FIX: Make req.query writable before mongoSanitize (EXPRESS 5 COMPATIBILITY)
app.use((req, res, next) => {
  // Create a writable copy of req.query
  const queryObj = { ...req.query };

  // Redefine req.query as a writable property
  Object.defineProperty(req, 'query', {
    value: queryObj,
    writable: true,
    enumerable: true,
    configurable: true,
  });

  next();
});

// Data sanitization against NoSQL query injection - configure for Express 5
app.use(mongoSanitize());

// Prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'maxGroupSize',
      'difficulty',
      'price',
    ],
  }),
);

// Test middleware
app.use((request, response, next) => {
  request.requestTime = new Date().toISOString();
  next();
});

// ------------- 3) Routes -------------
app.get('/', (request, response) => {
  response.status(200).render('base', {
    tour: 'The Forest Hiker',
    user: 'John Doe',
  });
});

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// Fix for Express 5: Replace app.all('*', ...) with catch-all middleware
app.use((request, response, next) => {
  next(new AppError(`Can't find ${request.originalUrl} on this server!`, 404));
});

// ERROR-HANDLING MIDDLEWARE
app.use(globalErrorHandler);

export default app;
