import Review from '../models/reviewModel.js';
import catchAsync from '../utils/catchAsync.js';

// ------------- 2) Route Handlers -------------
const getAllReviews = catchAsync(async (request, response, next) => {
  const reviews = await Review.find();

  // SEND RESPONSE
  response.status(200).json({
    status: 'success',
    requestedAt: request.requestTime,
    result: reviews.length,
    data: {
      reviews,
    },
  });
});

const createReview = catchAsync(async (request, response, next) => {
  const newReview = await Review.create(request.body);

  // SEND RESPONSE
  response.status(201).json({
    status: 'success',
    data: {
      review: newReview,
    },
  });
});

export { getAllReviews, createReview };
