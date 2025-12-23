/**
 * Middleware Barrel Export
 *
 * Why barrel export?
 * - Import all middleware from one place
 * - Cleaner imports in app.js
 * - Easy to see all available middleware
 *
 * Instead of:
 * const corsMiddleware = require('./middleware/cors.middleware');
 * const requestLogger = require('./middleware/requestLogger.middleware');
 * const errorHandler = require('./middleware/errorHandler.middleware');
 *
 * Just:
 * const { corsMiddleware, requestLogger, errorHandler } = require('./middleware');
 */

const corsMiddleware = require('./cors.middleware');
const requestLogger = require('./requestLogger.middleware');
const notFoundHandler = require('./notFound.middleware');
const errorHandler = require('./errorHandler.middleware');

module.exports = {
  corsMiddleware,
  requestLogger,
  notFoundHandler,
  errorHandler,
};
