const { closeDatabase } = require("./database.lifecycle");
const logger = require("../config/logger");

/**
 * Graceful Shutdown
 *
 * Why graceful shutdown?
 * - Finish processing current requests
 * - Close database connections properly
 * - Clean up resources
 * - Prevent data corruption
 *
 * Handles:
 * - SIGTERM (from Docker, Kubernetes)
 * - SIGINT (Ctrl+C in terminal)
 * - Uncaught exceptions
 * - Unhandled promise rejections
 */
const setupGracefulShutdown = (server) => {
    /**
     * Shutdown handler
     *
     * Steps:
     * 1. Stop accepting new requests
     * 2. Finish processing existing requests
     * 3. Close database connections
     * 4. Exit process
     */
    const shutdown = async (signal) => {
        logger.info(`${signal} received, starting graceful shutdown...`);

        // Stop accepting new connections
        server.close(async () => {
            logger.info("✅ HTTP server closed");

            try {
                // Close database connection
                await closeDatabase();

                logger.info("✅ Graceful shutdown complete");
                process.exit(0); // Exit successfully
            } catch (error) {
                logger.error("❌ Error during shutdown:", {
                    error: error.message,
                });
                process.exit(1); // Exit with error
            }
        });

        // Force shutdown after 10 seconds
        setTimeout(() => {
            logger.error("⚠️ Forced shutdown after timeout");
            process.exit(1);
        }, 10000);
    };

    // Handle termination signals
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));

    /**
     * Handle uncaught exceptions
     *
     * Why handle?
     * - Log the error before crash
     * - Attempt graceful shutdown
     * - Better than silent crash
     *
     */
    process.on("uncaughtException", (error) => {
        logger.error("❌ Uncaught Exception:", {
            error: error.message,
            stack: error.stack,
        });
        shutdown("UNCAUGHT_EXCEPTION");
    });

    /**
     * Handle unhandled promise rejections
     *
     * Why handle?
     * - Async errors that weren't caught
     * - Log before potential crash
     * - Helps debugging
     */
    process.on("unhandledRejection", (reason, promise) => {
        logger.error("❌ Unhandled Promise Rejection:", {
            reason,
            promise,
        });
        shutdown("UNHANDLED_REJECTION");
    });
};

module.exports = { setupGracefulShutdown };
