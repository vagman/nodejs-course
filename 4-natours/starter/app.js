import morgan from 'morgan';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();

// ------------ 1) Middleware Functions -------------
// Middleware: function that modifies the incoming request data
if (process.env.NODE_ENV === 'development')
  app.use(morgan('dev'));
app.use(express.json());

const __dirname = dirname(
  fileURLToPath(import.meta.url)
);
app.use(express.static(`${__dirname}/public`));

app.use((request, response, next) => {
  console.log(
    'Hello from the middleware function! ☕️'
  );
  next();
});

app.use((request, response, next) => {
  request.requestTime = new Date().toISOString();
  next();
});

// ------------- 3) Routes -------------
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

export default app;
