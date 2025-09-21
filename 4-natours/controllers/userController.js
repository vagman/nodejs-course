import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';
import AppError from './../utils/appError.js';
import * as factory from './handlerFactory.js';

const filterObject = (obj, ...allowedFields) => {
  const newObject = {};
  Object.keys(obj).forEach(element => {
    if (allowedFields.includes(element)) newObject[element] = obj[element];
  });
  return newObject;
};

// ------------- 2) Route Handlers -------------
const getAllUsers = catchAsync(async (request, response, next) => {
  const users = await User.find();

  // SEND RESPONSE
  response.status(200).json({
    status: 'success',
    requestedAt: request.requestTime,
    result: users.length,
    data: {
      users,
    },
  });
});

const updateCurrentUserData = catchAsync(async (request, response, next) => {
  // 1) Create error if user POSTs password data
  if (request.body.password || request.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400,
      ),
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObject(request.body, 'name', 'email');

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(
    request.user.id,
    filteredBody,
    {
      new: true,
      runValidator: true,
    },
  );

  response.status(200).json({
    status: 'success',
    data: updatedUser,
  });
});

const createUser = (request, response) => {
  response.status(500).json({
    status: 'error',
    message: 'This route is not yet defined.',
  });
};

const deleteMe = catchAsync(async (request, response, next) => {
  await User.findByIdAndUpdate(request.user.id, { active: false });

  response.status(204).json({
    status: 'success',
    data: null,
  });
});

const deleteUser = factory.deleteOne(User);

const getUser = (request, response) => {
  response.status(500).json({
    status: 'error',
    message: 'This route is not yet defined.',
  });
};

const updateUser = (request, response) => {
  response.status(500).json({
    status: 'error',
    message: 'This route is not yet defined.',
  });
};

export {
  getAllUsers,
  updateCurrentUserData,
  createUser,
  getUser,
  updateUser,
  deleteMe,
  deleteUser,
};
