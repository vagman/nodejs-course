import Stripe from 'stripe';

import Tour from '../models/tourModel.js';
import catchAsync from '../utils/catchAsync.js';
import * as factory from './handlerFactory.js';
import AppError from '../utils/appError.js';

const getCheckoutSession = catchAsync(async (request, response, next) => {
  // 0. Get thecurrently booked tour
  const tour = await Tour.findById(request.params.tourId);

  // 1. Create stripe checkout session
  // Adding this line in top-level code was producing error: "Neither apiKey nor config.authenticator provided" read more:https://stackoverflow.com/questions/79086035/firebase-deploy-error-neither-apikey-nor-config-authenticator-provided-using-s/
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

  // 2. Create checkout session
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    customer_email: request.user.email,
    client_reference_id: request.params.tourId, // to identify the tour
    line_items: [
      {
        price_data: {
          currency: 'usd',
          unit_amount: tour.price * 100,
          product_data: {
            name: `${tour.name} Tour`,
            description: tour.summary,
            images: [`https://www.natours.dev/img/tours/${tour.imageCover}`],
          },
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${request.protocol}://${request.get('host')}/`,
    cancel_url: `${request.protocol}://${request.get('host')}/tour/${tour.slug}`,
  });

  // 3. Create session as response (send the session back to the client)
  response.status(200).json({
    status: 'success',
    session,
  });
});

export { getCheckoutSession };
