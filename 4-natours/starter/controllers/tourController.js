import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';
import Tour from '../models/tourModel.js';

const __dirname = dirname(
  fileURLToPath(import.meta.url),
);

// Exercise: create your own middleware function checkBody()
// Check if the post(createTour()) request has the name and price properties.
// If not, send a 400 (BAD REQUEST) response with an error message.
// Then add it to the POST handler stack.
const checkBody = (request, response, next) => {
  if (!request.body.name || !request.body.price) {
    return response.status(400).json({
      status: 'fail',
      message: 'Missing name or price properties',
    });
  }
  next();
};

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
  // const tour = tours.find(
  //   (element) => element.id === id,
  // );

  // response.status(200).json({
  //   status: 'success',
  //   data: {
  //     tour,
  //   },
  // });
};

const createTour = (request, response) => {
  response.status(201).json({
    status: 'success',
    // data: {
    //   tour: newTour,
    // },
  });
};

const updateTour = (request, response) => {
  response.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour here...>',
    },
  });
};

const deleteTour = (request, response) => {
  response.status(204).json({
    status: 'success',
    data: null,
  });
};

export {
  // checkTourID,
  checkBody,
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
};
