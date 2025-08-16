import express from 'express';

// ------------- Route Handlers -------------
const getAllUsers = (request, response) => {
  response.status(500).json({
    status: 'error',
    message: 'This route is not yet defined.',
  });
};

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

const router = express.Router();
router.route('/').get(getAllUsers).post(createUser);

router
  .route('/:id')
  .get(getUser)
  .patch(updateUser)
  .delete(deleteUser);

export default router;
