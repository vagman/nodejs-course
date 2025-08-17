import { fileURLToPath } from 'node:url';
import { readFileSync, writeFile } from 'node:fs';
import { dirname } from 'node:path';

const __dirname = dirname(
  fileURLToPath(import.meta.url)
);
const tours = JSON.parse(
  readFileSync(
    `${__dirname}/../dev-data/data/tours-simple.json`
  )
);

// ------------- Middleware functions -------------
const checkTourID = (
  request,
  response,
  next,
  value
) => {
  console.log(`Tour ID is: ${value}`);
  // Converting the id from string to number and checking if the specific tour exists
  if (request.params.id * 1 > tours.length) {
    return response.status(404).json({
      status: 'fail',
      message: 'Invalid ID',
    });
  }
  next();
};

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
  const tour = tours.find(
    (element) => element.id === id
  );

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
  checkTourID,
  checkBody,
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
};
