const notFound = (req, res, next) => {
  console.log(req.url + " err");
    const error = new Error(`Not Found - ${req.originalUrl}`);
    res.status(404);
    next(error); // Passes the error to the next middleware
  };
  
  // Error handling middleware
const errorHandler = (err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode; 
    res.status(statusCode);
    res.json({
      message: err?.message,
      success: false,
      stack: err?.stack, 
    });
};
  
module.exports = { notFound, errorHandler };
  