import Tour from '../models/tourModel.js';
import APIFeatures from '../utils/apiFeatures.js';
import catchAsync from '../utils/catchAsync.js';

// Middleware for an alias that returns the top 5 in ratings & cheapest tours
const aliasTopTours = (request, response, next) => {
  // console.log('before', request.query);
  request.url =
    '?limit=5&sort=-ratingsAverage,price&fields=name,price,ratingsAverage,difficulty';
  next();
};

// ------------- 2) Route Handlers -------------
const getAllTours = catchAsync(
  async (request, response, next) => {
    const features = new APIFeatures(
      Tour.find(),
      request.query,
    )
      .filter()
      .sort()
      .limitFields()
      .paginate();
    const tours = await features.query;

    // SEND RESPONSE
    response.status(200).json({
      status: 'success',
      requestedAt: request.requestTime,
      result: tours.length,
      data: {
        tours,
      },
    });
  },
);

const getTour = catchAsync(
  async (request, response, next) => {
    const tour = await Tour.findById(
      request.params.id,
    );
    // Tour.findOne({ _id: request.params.id })

    response.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  },
);

const createTour = catchAsync(
  async (request, response, next) => {
    const newTour = await Tour.create(request.body);

    response.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  },
);

const updateTour = catchAsync(
  async (request, response, next) => {
    const tour = await Tour.findByIdAndUpdate(
      request.params.id,
      request.body,
      {
        new: true,
        runValidators: true,
      },
    );

    response.status(200).json({
      status: 'success',
      data: {
        tour,
      },
    });
  },
);

const deleteTour = catchAsync(
  async (request, response, next) => {
    await Tour.findByIdAndDelete(request.params.id);

    response.status(204).json({
      status: 'success',
      data: null,
    });
  },
);

const getTourStats = catchAsync(
  async (request, response, next) => {
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
  },
);

// TODO TASK: Implement an aggregation function that calculates the busiest month of a given year.
const getMonthlyPlan = catchAsync(
  async (request, response, next) => {
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
  },
);

export {
  aliasTopTours,
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
};
