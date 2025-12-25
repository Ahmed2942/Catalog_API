const multer = require("multer");
const fs = require("fs");
const { DIRS, ERROR_MESSAGES } = require("../utils/constants");
const logger = require("../config/logger");

/**
 * File Upload Middleware (Multer Configuration)
 *
 * Flow:
 * 1. Client uploads files
 * 2. Multer validates and saves to disk
 * 3. Files available in req.files
 * 4. After processing, we delete temp files
 */

// Ensure upload directory exists
const ensureUploadDir = async () => {
    try {
        await fs.promises.access(DIRS.UPLOAD_DIR);
    } catch (error) {
        logger.warn(`Upload directory does not exist: ${DIRS.UPLOAD_DIR}`);
        logger.info(`Creating upload directory: ${DIRS.UPLOAD_DIR}`);
        await fs.promises.mkdir(DIRS.UPLOAD_DIR, { recursive: true });
        logger.info(`Created upload directory: ${DIRS.UPLOAD_DIR}`);
    }
};

// Create upload directory on startup
ensureUploadDir();

// Multer Storage Configuration
const storage = multer.diskStorage({
    // Destination directory
    destination: (req, file, cb) => {
        cb(null, DIRS.UPLOAD_DIR);
    },

    // Filename: timestamp-originalname.csv
    filename: (req, file, cb) => {
        const timestamp = Date.now();
        const originalName = file.originalname;
        const filename = `${timestamp}-${originalName}`;
        cb(null, filename);
    },
});

// File Filter: Only allows CSV files
const fileFilter = (req, file, cb) => {
    // Check MIME type
    if (file.mimetype === "text/csv") {
        cb(null, true); // Accept file
    } else {
        // Reject file
        cb(new Error(ERROR_MESSAGES.INVALID_FILE_TYPE), false);
    }
};

/**
 * Multer Instance (Storage, Filter)
 *
 * Configured with:
 * - Storage: Where to save files
 * - File filter: What files to accept
 */
const upload = multer({
    storage,
    fileFilter,
});

// Upload Middleware for Import Endpoint
const uploadFiles = upload.fields([
    { name: "familiesFile", maxCount: 1 },
    { name: "productsFile", maxCount: 1 },
]);

// Cleanup uploaded files
const cleanupFiles = async (files) => {
    if (!files) return;

    try {
        // Delete families file
        if (files.familiesFile && files.familiesFile[0]) {
            await fs.promises.unlink(files.familiesFile[0].path);
            logger.info(`Deleted temp file: ${files.familiesFile[0].filename}`);
        }

        // Delete products file
        if (files.productsFile && files.productsFile[0]) {
            await fs.promises.unlink(files.productsFile[0].path);
            logger.info(`Deleted temp file: ${files.productsFile[0].filename}`);
        }
    } catch (error) {
        logger.error("Error cleaning up files:", { error: error.message });
    }
};

module.exports = {
    uploadFiles,
    cleanupFiles,
};
