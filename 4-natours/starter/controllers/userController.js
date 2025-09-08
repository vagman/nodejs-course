import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';

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

const createUser = (request, response) => {
  response.status(500).json({
    status: 'error',
    message: 'This route is not yet defined.',
  });
};

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

const deleteUser = (request, response) => {
  response.status(500).json({
    status: 'error',
    message: 'This route is not yet defined.',
  });
};

export { getAllUsers, createUser, getUser, updateUser, deleteUser };
