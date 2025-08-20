import express from 'express';
import * as tourController from '../controllers/tourController.js';

const router = express.Router();

// router.param('id', tourController.checkTourID);
router
  .route('/')
  .get(tourController.getAllTours)
  .post(tourController.checkBody)
  .post(
    tourController.checkBody,
    tourController.createTour,
  );

router
  .route('/:id')
  .get(tourController.getTour)
  .patch(tourController.updateTour)
  .delete(tourController.deleteTour);

export default router;
