/* eslint-disable */
import axios from 'axios';
import { showAlert } from './alerts';

const login = async (email, password) => {
  try {
    const response = await axios({
      method: 'POST',
      url: '/api/v1/users/login',
      data: {
        email,
        password,
      },
    });

    if (response.data.status === 'success') {
      showAlert('success', 'Logged in successfully!');
      window.setTimeout(() => {
        location.assign('/');
      }, 1500);
    }
  } catch (error) {
    showAlert('error', error.response?.data?.message || 'Something went wrong!');
  }
};

export default login;