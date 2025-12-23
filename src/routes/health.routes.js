const express = require('express');

/**
 * Health Check Routes
 * 
 * Why separate file?
 * - Keeps routes organized by feature
 * - Easy to add more health-related endpoints
 * - Can add detailed health checks (DB, cache, etc.)
 * - Testable independently
 */

const router = express.Router();

/**
 * GET /health
 * 
 * Basic health check endpoint
 * 
 * Used by:
 * - Kubernetes liveness/readiness probes
 * - Docker health checks
 * - Load balancers
 * - Monitoring tools (Datadog, New Relic, etc.)
 * 
 * Returns:
 * - 200 OK if service is running
 * - Service metadata (uptime, version, etc.)
 */
router.get('/', (req, res) => {
  res.json({
    status: 'OK',
    service: 'catalog-import-api',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0',
  });
});

/**
 * GET /health/detailed
 * 
 * Detailed health check (optional)
 * 
 * Checks:
 * - Database connection
 * - Memory usage
 * - Disk space
 * - External services
 * 
 * Note: Will implement in Phase 2
 */
router.get('/detailed', async (req, res) => {
  // TODO: Add detailed health checks
  res.json({
    status: 'OK',
    checks: {
      database: 'TODO',
      memory: process.memoryUsage(),
    },
  });
});

module.exports = router;