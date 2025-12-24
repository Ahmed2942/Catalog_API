const { Sequelize } = require('sequelize');
require('dotenv').config();

/**
 * Database Configura
 *
 * Why separate from initialization?
 * - Configuration is just settings
 * - Initialization is an action (connect, sync)
 * 
 */

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  dialect: 'mariadb',

  // Logging configuration
  logging: process.env.NODE_ENV === 'development' ? console.log : false,

  // Connection pool configuration
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },

  // Timezone configuration
  timezone: '+00:00',

  // Model defaults
  define: {
    timestamps: true,
    underscored: false,
    freezeTableName: true,
  },
});

module.exports = { sequelize };
