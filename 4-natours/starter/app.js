import morgan from 'morgan';
import express from 'express';
import qs from 'qs';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();
app.set('query parser', (str) => qs.parse(str));

// ------------ 1) Middleware Functions -------------
// Middleware: function that modifies the incoming request data
if (process.env.NODE_ENV === 'development')
  app.use(morgan('dev'));
app.use(express.json());

const __dirname = dirname(
  fileURLToPath(import.meta.url),
);
app.use(express.static(`${__dirname}/public`));

app.use((request, response, next) => {
  request.requestTime = new Date().toISOString();
  next();
});

// ------------- 3) Routes -------------
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('/{*any}', (request, response, next) => {
  // response.status(404).json({
  //   status: 'Fail',
  //   message: `Can't find ${request.originalUrl} on this server!`,
  // });

  const error = new Error(
    `Can't find ${request.originalUrl} on this server!`,
  );
  error.status = 'fail';
  error.statusCode = 404;

  next(error);
});

// ERROR-HANDLING MIDDLEWARE
app.use((error, request, response, next) => {
  console.log(error.statusCode);
  response.status(error.statusCode || 500);
  error.status = error.status || 'error';

  response.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
});

export default app;
