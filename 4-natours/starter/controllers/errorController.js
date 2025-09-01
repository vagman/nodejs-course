const globalErrorHandler = (
  error,
  request,
  response,
  next,
) => {
  console.log(error.stack);
  response.status(error.statusCode || 500);
  error.status = error.status || 'error';

  response.status(error.statusCode).json({
    status: error.status,
    message: error.message,
  });
};

export default globalErrorHandler;
