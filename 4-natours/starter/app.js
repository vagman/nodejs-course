import { fileURLToPath } from 'node:url';
import { dirname } from 'path';
import {
  readFileSync,
  write,
  writeFile,
} from 'node:fs';
import morgan from 'morgan';
import express from 'express';

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
const tours = JSON.parse(
  readFileSync(
    `${__dirname}/dev-data/data/tours-simple.json`
  )
);

// ------------- 2) Route Handlers -------------
const getAllTours = (request, response) => {
  console.log(request.requestTime);
  response.status(200).json({
    status: 'success',
    requestedAt: request.requestTime,
    result: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (request, response) => {
  // Convert string to number
  const id = request.params.id * 1;
  const tour = tours.find(
    (element) => element.id === id
  );

  // if (id > tours.length) {
  if (!tour) {
    return response.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  response.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const createTour = (request, response) => {
  const newTourId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign(
    { id: newTourId },
    request.body
  );

  tours.push(newTour);

  writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (error) => {
      response.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (request, response) => {
  // Converting the id from string to number and checking if the specific tour exists
  if (request.params.id * 1 > tours.length) {
    return response.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  response.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

const deleteTour = (request, response) => {
  // Converting the id from string to number and checking if the specific tour exists
  if (request.params.id * 1 > tours.length) {
    return response.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }

  response.status(204).json({
    status: 'success',
    data: null,
  });
};

const getAllUsers = (request, response) => {
  response.status(500).json({
    status: 'error',
    message: 'This route is not yet defined.',
  });
};

const createUser = (request, response) => {
  response.status(500).json({
    status: 'error',
    message: 'This route is not yet defined.',
  });
};

const getUser = (request, response) => {
  response.status(500).json({
    status: 'error',
    message: 'This route is not yet defined.',
  });
};

const updateUser = (request, response) => {
  response.status(500).json({
    status: 'error',
    message: 'This route is not yet defined.',
  });
};

const deleteUser = (request, response) => {
  response.status(500).json({
    status: 'error',
    message: 'This route is not yet defined.',
  });
};

// ------------- 3) Routes -------------
app
  .route('/api/v1/tours')
  .get(getAllTours)
  .post(createTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

app
  .route('/api/v1/users')
  .get(getAllUsers)
  .post(createUser);

app
  .route('/api/v1/users/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

// ------------- 4) Start Server -------------
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});
