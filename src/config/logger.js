const winston = require('winston');
const DailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
require('dotenv').config();

/**
 * Logger Configuration using Winston
 *
 * Why Winston?
 * - Production-grade logging
 * - Multiple transports (console, file, etc.)
 * - Log levels (error, warn, info, debug)
 * - Structured logging (JSON format)
 *
 * Log Levels (from highest to lowest priority):
 * - error: Critical errors that need immediate attention
 * - warn: Warning messages (potential issues)
 * - info: General informational messages
 * - http: HTTP request logs
 * - debug: Detailed debug information
 */

// Custom log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }), // Include stack traces
  winston.format.splat(), // String interpolation
  winston.format.json(), // JSON format for structured logging
);

// Console format (human-readable for development)
const consoleFormat = winston.format.combine(
  winston.format.colorize(), // Colorize output
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;

    // Add metadata if present
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }

    return msg;
  }),
);

/**
 * Daily Rotate File Transport
 *
 * Why rotate logs?
 * - Prevents single file from growing too large
 * - Easier to find specific dates
 * - Automatic cleanup of old logs
 * - Prevents disk space issues
 */
const fileRotateTransport = new DailyRotateFile({
  filename: path.join(process.env.LOG_DIR || './logs', 'app-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m', // Rotate if file exceeds 20MB
  maxFiles: '14d', // Keep logs for 14 days
  format: logFormat,
});

// Error-only log file
const errorFileTransport = new DailyRotateFile({
  filename: path.join(process.env.LOG_DIR || './logs', 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  level: 'error', // Only log errors
  maxSize: '20m',
  maxFiles: '30d', // Keep error logs longer (30 days)
  format: logFormat,
});

/**
 * Create Winston Logger Instance
 */
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  transports: [fileRotateTransport, errorFileTransport],

  // Handle uncaught exceptions and rejections
  exceptionHandlers: [
    new DailyRotateFile({
      filename: path.join(process.env.LOG_DIR || './logs', 'exceptions-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
    }),
  ],

  rejectionHandlers: [
    new DailyRotateFile({
      filename: path.join(process.env.LOG_DIR || './logs', 'rejections-%DATE%.log'),
      datePattern: 'YYYY-MM-DD',
      maxSize: '20m',
      maxFiles: '30d',
    }),
  ],
});

/**
 * Add console transport in development
 *
 * Why only in development?
 * - Production logs go to files/monitoring services
 * - Console output in production is usually lost
 * - Reduces noise in production environments
 */
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    }),
  );
}

module.exports = logger;
