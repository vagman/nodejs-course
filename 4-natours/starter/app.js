import morgan from 'morgan';
import express from 'express';
import qs from 'qs';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

import AppError from './utils/appError.js';
import globalErrorHandler from './controllers/errorController.js';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();
app.set('query parser', str => qs.parse(str));

// ------------ 1) Middleware Functions -------------
// Middleware: function that modifies the incoming request data
// Set security HTTP headers
app.use(helmet());

// Development Logging
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'));
app.use(express.json());

// Limit requests from same API
const limiter = rateLimit({
  max: 100,
  windowM: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour!',
});
app.use('/api', limiter);

// Body parser, reading data from body into req.body
app.use(express.json({ limit: '10kb' }));

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

app.all('/{*any}', (request, response, next) => {
  next(new AppError(`Can't find ${request.originalUrl} on this server!`, 404));
});

// ERROR-HANDLING MIDDLEWARE
app.use(globalErrorHandler);

export default app;
