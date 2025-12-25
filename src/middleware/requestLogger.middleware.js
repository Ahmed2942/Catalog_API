const logger = require("../config/logger");

/**
 * Request Logger Middleware
 *
 * Logs all HTTP requests
 */

const requestLogger = (req, res, next) => {
    const startTime = Date.now();
    // Log request
    logger.http("Incoming request", {
        event: "http_request",
        method: req.method,
        url: req.url,
        ip: req.ip,
        userAgent: req.header("user-agent"),
    });

    // Capture response
    res.on("finish", () => {
        const duration = Date.now() - startTime;

        logger.http("Request completed", {
            event: "http_response",
            method: req.method,
            url: req.url,
            statusCode: res.statusCode,
            duration: `${duration}ms`,
        });
    });

    next();
};

// Export requestLogger
module.exports = requestLogger;
