const logger = require('../config/logger');

/**
 * 404 Not Found Middleware
 * 
 * Why separate file?
 * - Keeps error handling logic organized
 * - Easy to customize 404 response
 * - Can add analytics for missing routes
 * - Clear separation from other error handlers
 * 
 * When it runs:
 * - After all routes have been checked
 * - Only if no route matched the request
 * - Must be defined AFTER all other routes
 */

const notFoundHandler = (req, res, next) => {
  // Log 404 for analytics
  logger.warn('Route not found', {
    method: req.method,
    path: req.path,
    ip: req.ip,
  });

  // Send 404 response
  res.status(404).json({
    error: 'Not Found',
    message: `Cannot ${req.method} ${req.path}`,
    path: req.path,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Why log 404s?
 * - Identify broken links
 * - Detect API misuse
 * - Find typos in frontend code
 * - Security: Detect scanning attempts
 * 
 * Example: Many 404s for /admin might indicate attack
 */

module.exports = notFoundHandler;