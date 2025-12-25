const app = require("./app");
const { initializeDatabase } = require("./infrastructure/database.lifecycle");
const { setupGracefulShutdown } = require("./infrastructure/server.lifecycle");
const logger = require("./config/logger");
require("dotenv").config();

/**
 * Server Startup
 *
 * Why separate from app.js? -> Can test app without starting server
 *
 * Responsibilities:
 * 1. Initialize database
 * 2. Start HTTP server
 * 3. Handle graceful shutdown
 * 4. Handle uncaught errors
 */

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "0.0.0.0";

/**
 * Start the server
 *
 * Steps:
 * 1. Initialize database (authenticate + sync)
 * 2. Start Express server
 * 3. Set up graceful shutdown handlers
 */
const startServer = async () => {
    try {
        // Step 1: Initialize database
        logger.info("🔄 Starting server initialization...");
        await initializeDatabase();

        // Step 2: Start HTTP server
        const server = app.listen(PORT, HOST, () => {
            logger.info("🚀 Server started successfully", {
                port: PORT,
                host: HOST,
                environment: process.env.NODE_ENV || "development",
                nodeVersion: process.version,
            });
            logger.info(`📝 Health check: http://${HOST}:${PORT}/health`);
        });

        // Step 3: Graceful shutdown handlers
        setupGracefulShutdown(server);
    } catch (error) {
        logger.error("❌ Failed to start server:", {
            error: error.message,
            stack: error.stack,
        });
        process.exit(1); // Exit with error code
    }
};

// Start the server
startServer();
