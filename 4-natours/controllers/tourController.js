import Tour from '../models/tourModel.js';
import catchAsync from '../utils/catchAsync.js';
import * as factory from './handlerFactory.js';
import AppError from '../utils/appError.js';

const aliasTopTours = (request, response, next) => {
  request.url =
    '?limit=5&sort=-ratingsAverage,price&fields=name,price,ratingsAverage,difficulty';
  next();
};

const getAllTours = factory.getAll(Tour);
const createTour = factory.createOne(Tour);
const getTour = factory.getOne(Tour, { path: 'reviews' });
const updateTour = factory.updateOne(Tour);
const deleteTour = factory.deleteOne(Tour);

const getTourStats = catchAsync(async (request, response, next) => {
  const stats = await Tour.aggregate([
    {
      $match: { ratingsAverage: { $gte: 4.5 } },
    },
    {
      $group: {
        // _id: '$ratingsAverage',
        _id: { $toUpper: '$difficulty' },
        numTours: { $sum: 1 },
        numRatings: { $sum: '$ratingsQuantity' },
        avgRating: { $avg: '$ratingsAverage' },
        avgPrice: { $avg: '$price' },
        minPrice: { $min: '$price' },
        maxPrice: { $max: '$price' },
      },
    },
    {
      $sort: { avgPrice: 1 },
    },
    // {
    //   $match: { _id: { $ne: 'EASY' } },
    // },
  ]);

  response.status(200).json({
    status: 'success',
    data: {
      stats,
    },
  });
});

// TODO TASK: Implement an aggregation function that calculates the busiest month of a given year.
const getMonthlyPlan = catchAsync(async (request, response, next) => {
  const year = request.params.year * 1; // 2021
  const plan = await Tour.aggregate([
    {
      $unwind: '$startDates',
    },
    {
      $match: {
        startDates: {
          $gte: new Date(`${year}-01-01`),
          $lte: new Date(`${year}-12-31`),
        },
      },
    },
    {
      $group: {
        _id: { $month: '$startDates' },
        numTourStarts: { $sum: 1 },
        tours: { $push: '$name' },
      },
    },
    {
      $addFields: { month: '$_id' },
    },
    {
      $project: {
        _id: 0,
      },
    },
    {
      $sort: { numTourStarts: -1 },
    },
    {
      $limit: 12,
    },
  ]);

  response.status(200).json({
    status: 'success',
    result: plan.length,
    data: {
      plan,
    },
  });
});

// /tours-within/:distance/center/:latlng/unit/:unit
// /tours-within?distance/233/center/37.9334753,-73.2561673/unit=mi
const getToursWithin = catchAsync(async (request, response, next) => {
  const { distance, latlng, unit } = request.params;
  const [lat, lng] = latlng.split(',');
  const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1;

  if (!lat || !lng) {
    next(
      new AppError(
        'Please provide latitude and longitude in the format lat,lng.',
        400,
      ),
    );
  }

  const tours = await Tour.find({
    startLocation: {
      $geoWithin: {
        $centerSphere: [[lng, lat], radius],
      },
    },
  });

  response.status(200).json({
    status: 'success',
    results: tours.length,
    data: {
      tours,
    },
  });
});

export {
  aliasTopTours,
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
  getToursWithin,
};
