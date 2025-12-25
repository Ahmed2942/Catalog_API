const fs = require("fs");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const path = require("path");
const { DIRS } = require("../utils/constants");
const logger = require("../config/logger");

/**
 * Failure Service
 */

// Ensure failure directory exists
const ensureFailureDir = async () => {
    try {
        await fs.promises.access(DIRS.FAILURE_DIR);
    } catch (error) {
        logger.warn(`Failure directory does not exist: ${DIRS.FAILURE_DIR}`);
        logger.info(`Creating failure directory: ${DIRS.FAILURE_DIR}`);
        await fs.promises.mkdir(DIRS.FAILURE_DIR, { recursive: true });
        logger.info(`Created failure directory: ${DIRS.FAILURE_DIR}`);
    }
};

ensureFailureDir();

// Write CSV File
const writeCSV = async (filepath, failures) => {
    // Write all records
    const csvWriter = createCsvWriter({
        path: filepath,
        header: [
            { id: "rowNumber", title: "rowNumber" },
            { id: "sku", title: "sku" },
            { id: "reason", title: "reason" },
        ],
        fieldDelimiter: ";",
        alwaysQuote: false,
    });

    await csvWriter.writeRecords(failures);
    logger.info(`CSV written/updated successfully at ${filepath}`);
};

// Export Family Failures to CSV: rowNumber,sku,reason
const exportFamilyFailures = async (failures) => {
    if (!failures || failures.length === 0) {
        logger.info("No family failures to export", {
            event: "failure_export_skipped",
            fileType: "families",
        });
        return null;
    }

    try {
        const timeStamp = new Date().toISOString().replace(/[:.]/g, "-");
        const filename = `${timeStamp}-families_failures.csv`;
        const filepath = path.join(DIRS.FAILURE_DIR, filename);

        await writeCSV(filepath, failures);

        logger.info("Family failures exported successfully", {
            event: "failure_export_success",
            fileType: "families",
            failureCount: failures.length,
            filepath,
        });

        return filepath;
    } catch (error) {
        logger.error("Failed to export family failures", {
            event: "failure_export_error",
            fileType: "families",
            error: error.message,
            stack: error.stack,
        });
        throw error;
    }
};

// Export Product Failures to CSV: rowNumber,sku,reason
const exportProductFailures = async (failures) => {
    if (!failures || failures.length === 0) {
        logger.info("No product failures to export", {
            event: "failure_export_skipped",
            fileType: "products",
        });
        return null;
    }

    try {
        const timeStamp = new Date().toISOString().replace(/[:.]/g, "-");
        const filename = `${timeStamp}-products_failures.csv`;
        const filepath = path.join(DIRS.FAILURE_DIR, filename);

        await writeCSV(filepath, failures);

        logger.info("Product failures exported successfully", {
            event: "failure_export_success",
            fileType: "products",
            failureCount: failures.length,
            filepath,
        });

        return filepath;
    } catch (error) {
        logger.error("Failed to export product failures", {
            event: "failure_export_error",
            fileType: "products",
            error: error.message,
            stack: error.stack,
        });
        throw error;
    }
};

module.exports = {
    exportFamilyFailures,
    exportProductFailures,
};
