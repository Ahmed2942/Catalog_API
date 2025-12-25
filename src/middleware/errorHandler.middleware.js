const logger = require("../config/logger");
require("dotenv").config();

/**
 * Global Error Handler Middleware
 *
 */

const errorHandler = (err, req, res, next) => {
    // Log error details
    logger.error("Error occurred", {
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
        error: err.name || "Error",
        message: err.message || "Internal Server Error",
        path: req.path,
        timestamp: new Date().toISOString(),
    };

    // Add stack trace in development only
    if (process.env.NODE_ENV === "development") {
        errorResponse.stack = err.stack;
    }

    // Send error response
    res.status(statusCode).json(errorResponse);
    next();
};

// Exports
module.exports = errorHandler;
