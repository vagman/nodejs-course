import Review from '../models/reviewModel.js';
import catchAsync from '../utils/catchAsync.js';
import * as factory from './handlerFactory.js';

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

const setTourUserId = (request, response, next) => {
  if (!request.body.tour) request.body.tour = request.params.tourId;
  if (!request.body.user) request.body.user = request.user.id;
  next();
};

const createReview = factory.createOne(Review);
const deleteReview = factory.deleteOne(Review);
const updateReview = factory.updateOne(Review);

export {
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  setTourUserId,
};
