const logger = require('../config/logger');

/**
 * Global Error Handler Middleware
 * 
 * Why separate file?
 * - Centralized error handling
 * - Easy to customize error responses
 * - Can add error reporting (Sentry, etc.)
 * - Keeps app.js clean
 * 
 * Catches:
 * - Errors thrown in routes
 * - Errors from async functions (with express-async-errors)
 * - Database errors
 * - Validation errors
 * - Any unhandled errors
 * 
 * IMPORTANT: Must have exactly 4 parameters (err, req, res, next)
 * - Express recognizes this signature as error handler
 */

const errorHandler = (err, req, res, next) => {
  // Log error details
  logger.error('Error occurred', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
    ip: req.ip,
    timestamp: new Date().toISOString(),
  });

  // Determine status code
  const statusCode = err.statusCode || err.status || 500;

  // Build error response
  const errorResponse = {
    error: err.name || 'Error',
    message: err.message || 'Internal Server Error',
    path: req.path,
    timestamp: new Date().toISOString(),
  };

  // Add stack trace in development only
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  // Handle specific error types
  if (err.name === 'ValidationError') {
    // Mongoose/Joi validation errors
    errorResponse.errors = err.errors;
  }

  if (err.name === 'SequelizeValidationError') {
    // Sequelize validation errors
    errorResponse.errors = err.errors.map((e) => ({
      field: e.path,
      message: e.message,
    }));
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    // Duplicate key errors
    errorResponse.message = 'Duplicate entry';
    errorResponse.field = err.errors[0]?.path;
  }

  // Send error response
  res.status(statusCode).json(errorResponse);
};

/**
 * Why handle specific error types?
 * - Better error messages for clients
 * - Easier debugging
 * - Consistent error format
 * 
 * Example responses:
 * 
 * Validation Error:
 * {
 *   "error": "ValidationError",
 *   "message": "Validation failed",
 *   "errors": [
 *     { "field": "sku", "message": "SKU is required" }
 *   ]
 * }
 * 
 * Duplicate Key:
 * {
 *   "error": "SequelizeUniqueConstraintError",
 *   "message": "Duplicate entry",
 *   "field": "sku"
 * }
 */

module.exports = errorHandler;