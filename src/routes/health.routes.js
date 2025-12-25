const express = require("express");
require("dotenv").config();

/**
 * Health Check Routes
 *
 */

const router = express.Router();

/**
 * GET /health
 *
 * Basic health check endpoint
 *
 *
 * Returns:
 * - 200 OK if service is running
 * - Service metadata (uptime, version, etc.)
 */
router.get("/", (req, res) => {
    res.json({
        status: "OK",
        service: "catalog-import-api",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || "development",
        version: process.env.npm_package_version || "1.0.0",
    });
});

module.exports = router;
