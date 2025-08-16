import { readFileSync, writeFile } from 'node:fs';
import { dirname } from 'path';
import express from 'express';

const tours = JSON.parse(
  readFileSync(
    `${__dirname}/dev-data/data/tours-simple.json`
  )
);

// ------------- Route Handlers -------------
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

const router = express.Router();
router.route('/').get(getAllTours).post(createTour);

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

export default router;
