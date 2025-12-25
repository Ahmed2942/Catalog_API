const winston = require("winston");
require("winston-daily-rotate-file");
const fs = require("fs");
const path = require("path");
const { LOG_LEVELS, DIRS } = require("../utils/constants");
require("dotenv").config();

/**
 * Logger Configuration
 *
 */

// Ensure log directory exists
const ensureLogDirectory = async () => {
    try {
        await fs.promises.access(DIRS.LOG_DIR);
    } catch (error) {
        await (fs.promises.mkdir(DIRS.LOG_DIR), { recursive: true });
    }
};

ensureLogDirectory();

/**
 * Custom Global Format
 */
const globalFormat = winston.format.combine(
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.splat(),
);

/**
 * Custom Log Format
 */
const logFormat = winston.format.combine(winston.format.json());

/**
 * Console Format (for development)
 *
 */
const consoleFormat = winston.format.combine(
    winston.format.colorize(),
    winston.format.printf(({ timestamp, level, message, ...metadata }) => {
        let msg = `${timestamp} [${level}]: ${message}`;
        if (Object.keys(metadata).length > 0) {
            msg += ` ${JSON.stringify(metadata)}`;
        }
        return msg;
    }),
);

/**
 * Transport: Daily Rotate File (All Logs)
 */
const fileRotateTransport = new winston.transports.DailyRotateFile({
    filename: path.join(DIRS.LOG_DIR, "app-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    maxSize: "20m",
    maxFiles: "14d",
    format: logFormat,
});

/**
 * Transport: Daily Rotate File (Errors Only)
 */
const errorFileRotateTransport = new winston.transports.DailyRotateFile({
    filename: path.join(DIRS.LOG_DIR, "error-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    level: "error",
    maxSize: "20m",
    maxFiles: "30d",
    format: logFormat,
});

/**
 * Transport: Console (Development)
 */
const consoleTransport = new winston.transports.Console({
    format: consoleFormat,
});

/**
 * Create Logger Instance
 */
const logger = winston.createLogger({
    level: process.env.LOG_LEVEL || LOG_LEVELS.INFO,
    format: globalFormat,
    transports: [fileRotateTransport, errorFileRotateTransport, consoleTransport],
    exitOnError: false,
});

/**
 * Helper Methods for Import Logging
 *
 */

/**
 * Log Import Start
 */
logger.logImportStart = (metadata) => {
    logger.info("Import process started", {
        event: "import_start",
        ...metadata,
    });
};

/**
 * Log Import End
 */
logger.logImportEnd = (metadata) => {
    logger.info("Import process completed", {
        event: "import_end",
        ...metadata,
    });
};

/**
 * Log File Summary
 */
logger.logFileSummary = (fileType, summary) => {
    logger.info(`${fileType} file processing summary`, {
        event: "file_summary",
        fileType,
        ...summary,
    });
};

/**
 * Log Import Warning
 */
logger.logImportWarning = (message, metadata) => {
    logger.warn(message, {
        event: "import_warning",
        ...metadata,
    });
};

/**
 * Log Import Error
 */
logger.logImportError = (message, metadata) => {
    logger.error(message, {
        event: "import_error",
        ...metadata,
    });
};

/**
 * Log Row Processing
 */
logger.logRowProcessing = (fileType, rowNumber, operation, metadata = {}) => {
    logger.debug(`Row ${rowNumber} ${operation}`, {
        event: "row_processing",
        fileType,
        rowNumber,
        operation,
        ...metadata,
    });
};

module.exports = logger;
