import morgan from 'morgan';
import express from 'express';
import qs from 'qs';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import validator from 'validator';
import hpp from 'hpp';

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

import AppError from './utils/appError.js';
import globalErrorHandler from './controllers/errorController.js';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();

// ------------ 1) Middleware Functions -------------
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

// Data sanitization against NoSQL query injection - configure for Express 5
app.use(mongoSanitize({ replaceWith: '_' }));

// Data sanitization against XSS (Cross-Site Scripting) attacks
app.use((req, res, next) => {
  const clean = obj => {
    if (obj && typeof obj === 'object') {
      for (const key in obj) {
        if (typeof obj[key] === 'string') {
          obj[key] = validator.escape(obj[key]);
        } else if (typeof obj[key] === 'object') {
          clean(obj[key]);
        }
      }
    }
  };

  if (req.body) clean(req.body);
  if (req.query) clean(req.query);
  if (req.params) clean(req.params);

  next();
});

// Prevent parameter pollution
app.use(hpp());

// Serving static files
const __dirname = dirname(fileURLToPath(import.meta.url));
app.use(express.static(`${__dirname}/public`));

// Test middleware
app.use((request, response, next) => {
  request.requestTime = new Date().toISOString();
  next();
});

// ------------- 3) Routes -------------
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// Fix for Express 5: Replace app.all('*', ...) with catch-all middleware
app.use((request, response, next) => {
  next(new AppError(`Can't find ${request.originalUrl} on this server!`, 404));
});

// ERROR-HANDLING MIDDLEWARE
app.use(globalErrorHandler);

export default app;
