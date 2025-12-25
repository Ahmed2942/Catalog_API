const { Sequelize } = require("sequelize");
require("dotenv").config();

/**
 * Database Configuration
 *
 * Why separate from initialization?
 * - Configuration is just settings
 * - Initialization is an action (connect, sync)
 *
 */

const sequelize = new Sequelize({
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.NODE_ENV === "development" ? process.env.DB_DEV_NAME : process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: "mariadb",

    // Logging configuration
    logging: process.env.NODE_ENV === "development" ? console.log : false,

    // Timezone configuration
    timezone: "+00:00",
});

// Export modules
module.exports = {
    sequelize,
};
