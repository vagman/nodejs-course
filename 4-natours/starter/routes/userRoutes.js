import express from 'express';
import {
  getAllUsers,
  createUser,
  updateCurrentUserData,
  getUser,
  updateUser,
  deleteUser,
} from '../controllers/userController.js';
import {
  login,
  signup,
  forgotPassword,
  resetPassword,
  protect,
  updatePassword,
} from '../controllers/authController.js';

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.post('/forgotPassword', forgotPassword);
router.patch('/resetPassword/:token', resetPassword);

router.patch('/updateMyPassword', protect, updatePassword);

router.patch('/updateMe', protect, updateCurrentUserData);
router.delete('/deleteMe', protect, deleteUser);

router.route('/').get(getAllUsers).post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

export default router;
