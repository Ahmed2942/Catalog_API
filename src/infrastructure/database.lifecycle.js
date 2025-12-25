const { sequelize } = require("../config/database");
const logger = require("../config/logger");
require("dotenv").config();

/**
 * Database Initialization
 *
 * What it does:
 * 1. Test database connection (authenticate)
 * 2. Sync models with database
 * 3. Initialize database
 * 4. Close database
 */

/**
 * Test database connection
 *
 * Why authenticate?
 * - Verifies credentials are correct
 * - Checks if database is reachable
 * - Fails fast if connection issues
 *
 */
const authenticateDatabase = async () => {
    try {
        await sequelize.authenticate();
        logger.info("✅ Database connection established successfully");
        return true;
    } catch (error) {
        logger.error("❌ Unable to connect to database:", {
            error: error.message,
            host: process.env.DB_HOST,
            database: process.env.DB_NAME,
        });
        throw error;
    }
};

/**
 * Synchronize database models
 *
 * Why sync?
 * - Creates tables if they don't exist
 * - Updates schema in development (with alter)
 * - Ensures models match database structure
 *
 * Options:
 * - alter: true (dev) - Updates existing tables without data loss
 * - alter: false (prod) - Use migrations instead
 * - force: true - DROPS tables (NEVER use in production!)
 *
 */

const syncDatabase = async () => {
    try {
        const syncOptions = {
            alter: process.env.NODE_ENV === "development",
            force: false, // NEVER set to true in production!
        };

        await sequelize.sync(syncOptions);

        if (syncOptions.alter) {
            logger.info("✅ Database models synchronized (ALTER mode)");
        } else {
            logger.info("✅ Database models synchronized");
        }

        return true;
    } catch (error) {
        logger.error("❌ Failed to sync database models:", {
            error: error.message,
        });
        throw error;
    }
};

/**
 * Initialize database (authenticate + sync)
 *
 * Why combined function?
 * - Single entry point for database setup
 * - Ensures proper order (authenticate before sync)
 * - Easy to call from server.js
 *
 */
const initializeDatabase = async () => {
    logger.info("🔄 Initializing database...");

    // Step 1: Test connection
    await authenticateDatabase();

    // Step 2: Sync models
    if (process.env.MIGRATIONS_OVER_SYNC !== "enable") {
        await syncDatabase();
    }

    logger.info("✅ Database initialization complete");
    return true;
};

/**
 * Close database connection
 *
 * Why needed?
 * - Graceful shutdown
 * - Clean up resources
 * - Important for testing (close after tests)
 */
const closeDatabase = async () => {
    try {
        await sequelize.close();
        logger.info("✅ Database connection closed");
    } catch (error) {
        logger.error("❌ Error closing database connection:", {
            error: error.message,
        });
        throw error;
    }
};

module.exports = {
    initializeDatabase,
    closeDatabase,
};
