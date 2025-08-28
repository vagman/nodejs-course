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

const router = express.Router();

// router.param('id', tourController.checkTourID);
router
  .route('/top-5-cheap')
  .get(aliasTopTours, getAllTours);

router.route('/tour-stats').get(getTourStats);

router
  .route('/monthly-plan/:year')
  .get(getMonthlyPlan);

router
  .route('/')
  .get(getAllTours)
  // .post(tourController.checkBody)
  .post(
    // tourController.checkBody,
    createTour,
  );

router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

export default router;
