const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { FILE_UPLOAD, ERROR_MESSAGES } = require('../utils/constants');
const logger = require('../config/logger');

/**
 * File Upload Middleware (Multer Configuration)
 *
 * Why Multer?
 * - Handles multipart/form-data (file uploads)
 * - Validates file types and sizes
 * - Stores files temporarily
 * - Easy to configure
 *
 * Flow:
 * 1. Client uploads files
 * 2. Multer validates and saves to disk
 * 3. Files available in req.files
 * 4. After processing, we delete temp files
 */

/**
 * Ensure upload directory exists
 *
 * Why?
 * - Multer needs directory to exist
 * - Create if missing
 */
const ensureUploadDir = () => {
  if (!fs.existsSync(FILE_UPLOAD.UPLOAD_DIR)) {
    fs.mkdirSync(FILE_UPLOAD.UPLOAD_DIR, { recursive: true });
    logger.info(`Created upload directory: ${FILE_UPLOAD.UPLOAD_DIR}`);
  }
};

// Create upload directory on startup
ensureUploadDir();

/**
 * Multer Storage Configuration
 *
 * Defines where and how to store uploaded files
 */
const storage = multer.diskStorage({
  /**
   * Destination directory
   *
   * @param {object} req - Express request
   * @param {object} file - Uploaded file
   * @param {function} cb - Callback(error, destination)
   */
  destination: (req, file, cb) => {
    cb(null, FILE_UPLOAD.UPLOAD_DIR);
  },

  /**
   * Filename
   *
   * Format: timestamp-originalname.csv
   * Example: 1703345678901-families.csv
   *
   * Why timestamp?
   * - Prevents filename conflicts
   * - Easy to identify when uploaded
   *
   * @param {object} req - Express request
   * @param {object} file - Uploaded file
   * @param {function} cb - Callback(error, filename)
   */
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const originalName = file.originalname;
    const filename = `${timestamp}-${originalName}`;
    cb(null, filename);
  },
});

/**
 * File Filter
 *
 * Validates file type before upload
 * Only allows CSV files
 *
 * @param {object} req - Express request
 * @param {object} file - Uploaded file
 * @param {function} cb - Callback(error, accept)
 */
const fileFilter = (req, file, cb) => {
  // Check MIME type
  if (FILE_UPLOAD.ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true); // Accept file
  } else {
    // Reject file
    cb(new Error(ERROR_MESSAGES.INVALID_FILE_TYPE), false);
  }
};

/**
 * Multer Instance
 *
 * Configured with:
 * - Storage: Where to save files
 * - File filter: What files to accept
 * - Size limit: Max file size
 */
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: FILE_UPLOAD.MAX_SIZE,
  },
});

/**
 * Upload Middleware for Import Endpoint
 *
 * Expects two files:
 * - familiesFile (families.csv)
 * - productsFile (products.csv)
 *
 * Usage in route:
 * router.post('/import', uploadFiles, importController.import);
 */
const uploadFiles = upload.fields([
  { name: 'familiesFile', maxCount: 1 },
  { name: 'productsFile', maxCount: 1 },
]);

/**
 * Cleanup uploaded files
 *
 * Why?
 * - Remove temporary files after processing
 * - Prevent disk space issues
 * - Security (don't keep uploaded files)
 *
 * @param {object} files - req.files object from multer
 */
const cleanupFiles = (files) => {
  if (!files) return;

  try {
    // Delete families file
    if (files.familiesFile && files.familiesFile[0]) {
      fs.unlinkSync(files.familiesFile[0].path);
      logger.info(`Deleted temp file: ${files.familiesFile[0].filename}`);
    }

    // Delete products file
    if (files.productsFile && files.productsFile[0]) {
      fs.unlinkSync(files.productsFile[0].path);
      logger.info(`Deleted temp file: ${files.productsFile[0].filename}`);
    }
  } catch (error) {
    logger.error('Error cleaning up files:', { error: error.message });
  }
};

module.exports = {
  uploadFiles,
  cleanupFiles,
};
