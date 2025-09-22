import express from 'express';
import {
  getAllReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
  setTourUserIds,
} from '../controllers/reviewController.js';
import { protect, restrictTo } from '../controllers/authController.js';

// POST /tour/12sd34(tour_id).../reviews
// POST /reviews
// Both routes should lead to the router below
const router = express.Router({
  // To get access to params from other routers (tourId in this case)
  mergeParams: true,
});

router
  .route('/')
  .get(getAllReviews)
  .post(protect, restrictTo('user'), setTourUserIds, createReview);

router.route('/:id').get(getReview).patch(updateReview).delete(deleteReview);

export default router;
