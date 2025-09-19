import express from 'express';
import {
  aliasTopTours,
  getAllTours,
  getTour,
  createTour,
  updateTour,
  deleteTour,
  getTourStats,
  getMonthlyPlan,
} from '../controllers/tourController.js';
import { protect, restrictTo } from '../controllers/authController.js';
import { createReview } from '../controllers/reviewController.js';

const router = express.Router();

// router.param('id', tourController.checkTourID);
router.route('/top-5-cheap').get(aliasTopTours, getAllTours);

router.route('/tour-stats').get(getTourStats);

router.route('/monthly-plan/:year').get(getMonthlyPlan);

router.route('/').get(protect, getAllTours).post(
  // tourController.checkBody,
  createTour,
);

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo('admin', 'lead-guide'), deleteTour);

// POST /tour/(tour_id)123asdf4.../reviews
// GET /tour/(tour_id)123asdf4.../reviews
// GET /tour/(tour_id)123asdf4.../reviews/(review_id)123asdf4...

router
  .route('/:tourId/reviews')
  .post(protect, restrictTo('user'), createReview);

export default router;
