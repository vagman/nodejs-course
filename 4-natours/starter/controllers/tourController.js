import Tour from '../models/tourModel.js';
import APIFeatures from '../utils/apiFeatures.js';

// Middleware for an alias that returns the top 5 in ratings & cheapest tours
const aliasTopTours = (request, response, next) => {
  // console.log('before', request.query);
  request.url =
    '?limit=5&sort=-ratingsAverage,price&fields=name,price,ratingsAverage,difficulty';
  next();
};

// ------------- 2) Route Handlers -------------
const getAllTours = async (request, response) => {
  try {
    // EXECUTE QUERY
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
  } catch (error) {
    response.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

const getTour = async (request, response) => {
  try {
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
  } catch (error) {
    response.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

const createTour = async (request, response) => {
  try {
    // 1st way: create an object and then save it to the database
    // const newTour = new Tour({});
    // newTour.save();

    // 2st way:
    const newTour = await Tour.create(request.body);

    response.status(201).json({
      status: 'success',
      data: {
        tour: newTour,
      },
    });
  } catch (error) {
    response.status(400).json({
      status: 'fail',
      message: '💣💣💣 ERROR: ' + error.message,
    });
  }
};

const updateTour = async (request, response) => {
  try {
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
  } catch (error) {
    response.status(400).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
};

const deleteTour = async (request, response) => {
  try {
    await Tour.findByIdAndDelete(request.params.id);

    response.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    response.status(404).json({
      status: 'fail',
      message: 'Invalid data sent!',
    });
  }
};

const getTourStats = async (request, response) => {
  try {
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
  } catch (error) {
    response.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

// TODO TASK: Implement an aggregation function that calculates the busiest month of a given year.

const getMonthlyPlan = async (request, response) => {
  try {
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
  } catch (error) {
    response.status(404).json({
      status: 'fail',
      message: error,
    });
  }
};

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
