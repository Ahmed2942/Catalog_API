const logger = require('../config/logger');

/**
 * Request Logger Middleware
 * 
 * Why separate file?
 * - Keeps app.js clean
 * - Easy to modify logging format
 * - Can add more logging logic without cluttering app.js
 * - Reusable in other projects
 * 
 * What it logs:
 * - HTTP method (GET, POST, etc.)
 * - Request path
 * - Client IP address
 * - User agent (browser/client info)
 * - Request timestamp
 */

const requestLogger = (req, res, next) => {
  // Log incoming request
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    timestamp: new Date().toISOString(),
  });

  // Optional: Log response when finished
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    logger.info('Request completed', {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
    });
  });

  next();
};

/**
 * Why log on 'finish' event?
 * - Captures response status code
 * - Measures request duration
 * - Helps identify slow endpoints
 * 
 * Example log output:
 * {
 *   "level": "info",
 *   "message": "Request completed",
 *   "method": "POST",
 *   "path": "/api/import",
 *   "statusCode": 200,
 *   "duration": "1234ms"
 * }
 */

module.exports = requestLogger;