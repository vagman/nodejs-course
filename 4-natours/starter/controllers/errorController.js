import AppError from './../utils/appError.js';

const handleCastErrorDB = error => {
  const message = `Invalid ${error.path}: ${error.value}.`;
  return new AppError(message, 400);
};

const sendErrorDev = (error, response) => {
  response.status(error.statusCode || 500).json({
    status: error.status,
    error: error,
    message: error.message,
    stack: error.stack,
  });
};

const sendErrorProd = (error, response) => {
  // Operational, trusted error: send message to client
  if (error.isOperational) {
    response.status(error.statusCode || 500).json({
      status: error.status,
      message: error.message,
    });

    // Programming or other unknown error: don't leak error details
  } else {
    // 1) Log error
    console.error('ERROR 💥', error);

    // 2) Send generic message
    response.status(500).json({
      status: 'error',
      message: 'Something went very wrong!',
    });
  }
};

const globalErrorHandler = (
  error,
  request,
  response,
  next,
) => {
  // console.log(error.stack);
  (response.status(error.statusCode || 500),
    (error.status = error.status || 'error'));

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(error, response);
  } else {
    // Hide error details in production
    let errorObj = { ...error };
    errorObj.message = error.message;

    if (error.name === 'CastError')
      errorObj = handleCastErrorDB(error);

    sendErrorProd(errorObj, response);
  }
};

export default globalErrorHandler;
