const express = require('express');
const healthRoutes = require('./health.routes');

/**
 * Main Router
 *
 * Why main router?
 * - Combines all route modules
 * - Single entry point for all routes
 * - Easy to add/remove route modules
 * - Keeps app.js clean
 *
 * Structure:
 * /health          → Health check routes
 * /api/import      → Import routes (Phase 2)
 * /api/search      → Search routes (Phase 2)
 */

const router = express.Router();

/**
 * Mount route modules
 *
 * Pattern: router.use(path, routeModule)
 */

// Health check routes
router.use('/health', healthRoutes);

/**
 * API routes (will be added in Phase 2)
 *
 * Example:
 * const importRoutes = require('./import.routes');
 * const searchRoutes = require('./search.routes');
 *
 * router.use('/api/import', importRoutes);
 * router.use('/api/search', searchRoutes);
 */

// TODO: Add import routes in Phase 2
// TODO: Add search routes in Phase 2

module.exports = router;
