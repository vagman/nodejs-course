import Tour from '../models/tourModel.js';
import catchAsync from '../utils/catchAsync.js';

const getOverview = catchAsync(async (request, response, next) => {
  // 1. Get tour data from collection
  const tours = await Tour.find();

  // 2. Build template

  // 3. Render that template using tour data from Step 1.

  response.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

const getTour = catchAsync(async (request, response) => {
  // 1. Get the data for the request tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: request.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  // 2. Build template

  // 3. Render that template using tour data from Step 1.
  response.status(200).render('tour', {
    title: 'The Forest Hiker Tour',
    tour,
  });
});

export { getOverview, getTour };
