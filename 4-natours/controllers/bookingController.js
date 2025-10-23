import stripe from 'stripe';

import Tour from '../models/tourModel.js';
import catchAsync from '../utils/catchAsync.js';
import * as factory from './handlerFactory.js';
import AppError from '../utils/appError.js';

const getCheckoutSession = catchAsync( async (request, response, next) => {
  // 1.Get thecurrently booked tour
    const tour = await Tour.findById(request.params.tourId);
  // 2. Create checkout session

  // 3. Create session as response (send the session back to the client)
  response.status(200).json({
    status: 'success',
    message: 'This is a placeholder for the checkout session.',
  });
});

export { getCheckoutSession };
