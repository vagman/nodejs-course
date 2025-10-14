import User from '../models/userModel.js';
import Tour from '../models/tourModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from '../utils/appError.js';

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

const getTour = catchAsync(async (request, response, next) => {
  // 1. Get the data for the request tour (including reviews and guides)
  const tour = await Tour.findOne({ slug: request.params.slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });

  if (!tour) {
    return next(new AppError('There is no tour with that name', 404));
  }

  // 2. Build template
  // 3. Render that template using tour data from Step 1.
  response.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour,
  });
});

const getLoginForm = catchAsync(async (request, response) => {
  response.status(200).render('login', {
    title: 'Log into your account',
  });
});

const getAccount = (request, response) => {
  response.status(200).render('account', {
    title: 'Your account',
  });
};

const updateUserData = catchAsync(async (request, response, next) => {
  const updatedUser = await User.findByIdAndUpdate(
    request.user.id,
    {
      name: request.body.name,
      email: request.body.email,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  response.status(200).render('account', {
    title: 'Your account',
    user: updatedUser,
  });
});

export { getOverview, getTour, getLoginForm, getAccount, updateUserData };
