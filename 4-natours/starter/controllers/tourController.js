import Tour from '../models/tourModel.js';

// ------------- 2) Route Handlers -------------
const getAllTours = async (request, response) => {
  try {
    console.log(request.query);
    // 1) BUILD QUERY
    // 1A) query filtering
    const parsedQuery = { ...request.query };

    const excludedFields = [
      'page',
      'sort',
      'limit',
      'fields',
    ];
    excludedFields.forEach(
      (element) => delete parsedQuery[element],
    );

    // 1B) Advanced query filtering: Convert operators to MongoDB format
    let queryStr = JSON.stringify(parsedQuery);
    queryStr = queryStr.replace(
      /\b(gte|gt|lte|lt)\b/g,
      (match) => `$${match}`,
    );

    const mongoQuery = JSON.parse(queryStr);

    // 2) SORTING
    let query = Tour.find(mongoQuery);
    if (request.query.sort) {
      const sortBy = request.query.sort
        .split(',')
        .join(' ');
      query.sort(sortBy);
    }

    // 3) FIELD LIMITING
    if (request.query.fields) {
      const fields = request.query.fields
        .split(',')
        .join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // 4) PAGINATION
    const page = request.query.page * 1 || 1;
    const limit = request.query.limit || 100;
    const skip = (page - 1) * limit;

    // page=2&limit=10 means: tours 1-10 for page 1, 11-20 for page 2, 21-30 for page 3, ...
    query = query.skip(skip).limit(limit);

    if (request.query.page) {
      const tourAmount = await Tour.countDocuments();
      if (skip >= tourAmount)
        throw new Error('This page does not exist');
    }

    // EXECUTE QUERY
    const tours = await query;

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

export {
  // checkTourID,
  // checkBody,
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
};
