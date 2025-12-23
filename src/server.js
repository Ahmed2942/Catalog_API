const app = require('./app');
const { initializeDatabase, closeDatabase } = require('./config/database.init');
const logger = require('./config/logger');

/**
 * Server Startup
 *
 * Why separate from app.js?
 * - app.js = Express configuration (pure, testable)
 * - server.js = Server lifecycle (startup, shutdown)
 * - Can test app without starting server
 * - Can reuse app in different contexts
 *
 * Responsibilities:
 * 1. Initialize database
 * 2. Start HTTP server
 * 3. Handle graceful shutdown
 * 4. Handle uncaught errors
 */

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

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
    logger.info('🔄 Starting server initialization...');
    await initializeDatabase();

    // Step 2: Start HTTP server
    const server = app.listen(PORT, HOST, () => {
      logger.info('🚀 Server started successfully', {
        port: PORT,
        host: HOST,
        environment: process.env.NODE_ENV || 'development',
        nodeVersion: process.version,
      });
      logger.info(`📝 Health check: http://${HOST}:${PORT}/health`);
    });

    // Step 3: Graceful shutdown handlers
    setupGracefulShutdown(server);
  } catch (error) {
    logger.error('❌ Failed to start server:', {
      error: error.message,
      stack: error.stack,
    });
    process.exit(1); // Exit with error code
  }
};

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
 *
 * @param {http.Server} server - HTTP server instance
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
      logger.info('✅ HTTP server closed');

      try {
        // Close database connection
        await closeDatabase();

        logger.info('✅ Graceful shutdown complete');
        process.exit(0); // Exit successfully
      } catch (error) {
        logger.error('❌ Error during shutdown:', {
          error: error.message,
        });
        process.exit(1); // Exit with error
      }
    });

    // Force shutdown after 10 seconds
    setTimeout(() => {
      logger.error('⚠️ Forced shutdown after timeout');
      process.exit(1);
    }, 10000);
  };

  // Handle termination signals
  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  /**
   * Handle uncaught exceptions
   *
   * Why handle?
   * - Log the error before crash
   * - Attempt graceful shutdown
   * - Better than silent crash
   *
   * Note: App should still crash (can't recover from uncaught exception)
   */
  process.on('uncaughtException', (error) => {
    logger.error('❌ Uncaught Exception:', {
      error: error.message,
      stack: error.stack,
    });
    shutdown('UNCAUGHT_EXCEPTION');
  });

  /**
   * Handle unhandled promise rejections
   *
   * Why handle?
   * - Async errors that weren't caught
   * - Log before potential crash
   * - Helps debugging
   */
  process.on('unhandledRejection', (reason, promise) => {
    logger.error('❌ Unhandled Promise Rejection:', {
      reason: reason,
      promise: promise,
    });
    shutdown('UNHANDLED_REJECTION');
  });
};

// Start the server
startServer();
