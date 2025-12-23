const express = require('express');
require('dotenv').config();

// Import middleware
const { corsMiddleware, requestLogger, notFoundHandler, errorHandler } = require('./middleware');

// Import routes
const routes = require('./routes');

// Import models to register them with Sequelize
require('./models');

/**
 * Express Application Configuration
 *
 * This file now ONLY:
 * 1. Creates Express app
 * 2. Applies middleware (imported)
 * 3. Mounts routes (imported)
 * 4. Applies error handlers (imported)
 *
 * All logic is in separate files!
 */

const app = express();

/**
 * Apply Middleware
 *
 * Order matters! Middleware executes top-to-bottom
 */

// 1. CORS - Allow cross-origin requests
app.use(corsMiddleware);

// 2. Body Parsers - Parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// 3. Request Logger - Log all incoming requests
app.use(requestLogger);

/**
 * Mount Routes
 *
 * All routes are defined in routes/index.js
 * This keeps app.js clean and focused
 */
app.use('/', routes);

/**
 * Error Handling Middleware
 *
 * Must be AFTER all routes!
 * Order: 404 handler → Error handler
 */

// 1. 404 Handler - Catch undefined routes
app.use(notFoundHandler);

// 2. Global Error Handler - Catch all errors
app.use(errorHandler);

/**
 * Export app for use in:
 * - server.js (start HTTP server)
 * - tests (supertest)
 */
module.exports = app;
