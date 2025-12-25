const logger = require("../config/logger");

/**
 * 404 Not Found Middleware
 *
 * When it runs:
 * - After all routes have been checked
 * - Only if no route matched the request
 * - Must be defined AFTER all other routes
 */

const notFoundHandler = (req, res, next) => {
    // Log 404 for analytics
    logger.warn("Route not found", {
        method: req.method,
        path: req.path,
        ip: req.ip,
    });

    // Send 404 response
    res.status(404).json({
        error: "Not Found",
        message: `Cannot ${req.method} ${req.path}`,
        path: req.path,
        timestamp: new Date().toISOString(),
    });
    next();
};

module.exports = notFoundHandler;
