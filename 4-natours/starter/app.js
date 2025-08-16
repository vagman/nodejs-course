import { fileURLToPath } from 'node:url';
import { dirname } from 'path';
import morgan from 'morgan';
import express from 'express';
import tourRouter from './routes/tourRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();

// ------------ 1) Middleware Functions -------------
// Middleware: function that modifies the incoming request data
app.use(morgan('dev'));
app.use(express.json());
// next is always the 3rd argument
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ------------- 3) Routes -------------

app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// ------------- 4) Start Server -------------
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
