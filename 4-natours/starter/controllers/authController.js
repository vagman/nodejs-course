import User from '../models/userModel.js';
import catchAsync from '../utils/catchAsync.js';

const signup = catchAsync(
  async (request, response, next) => {
    const newUser = await User.create(request.body);

    response.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  },
);

export { signup };
