/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';
import isEmail from 'validator/lib/isEmail.js';

// updateData function - This is implemented after we did the initial method for updating user data that didn't need the api.
const updateData = async (name, email) => {
  try {
    const response = await axios({
      method: 'PATCH',
      url: '/api/v1/users/updateMe',
      data: {
        name,
        email,
      },
    });

    if (response.data.status === 'success' && isEmail(email)) {
      showAlert('success', 'Data updated successfully!');
    } else if (!isEmail(email)) {
      showAlert('error', 'Please provide a valid email address!');
    }
  } catch (error) {
    showAlert(
      'error',
      error.response?.data?.message || 'Something went wrong!',
    );
  }
};

export default updateData;
