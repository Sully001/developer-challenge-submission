export const errorHandler = (error, req, res, next) => {
  console.error(error.stack);

  const statusCode = error.statusCode || 500;
  const response = {
    error: {
      message: error.message || "Internal Server Error",
      statusCode,
      details: error.details || [],
    },
  };

  res.status(statusCode).json(response);
};
