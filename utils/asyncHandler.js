const asyncHandler = (fn) => async (req, res, next) => {
  try {
    return await fn(req, res, next);
  } catch (error) {
    res
      .json({
        success: false,
        message: error.message,
      })
      .status(error.code || 500);
  }
};

export { asyncHandler };

/*
another way of writing asyncHandler

const asyncHandler = (fn) => {
  (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch((err)=>next(err));
  };
};
*/
