const fs = require('fs');
const path = require('path');
const { FILE_UPLOAD } = require('../utils/constants');
const logger = require('../config/logger');

/**
 * Failure Service
 * 
 * Why track failures?
 * - Business requirement: Export failures to CSV
 * - Helps users fix data issues
 * - Audit trail
 * 
 * Why NOT use csv-writer?
 * - Minimize dependencies
 * - Simple CSV format doesn't need a library
 * - Built-in fs module is sufficient
 */

// Ensure failure directory exists
if (!fs.existsSync(FILE_UPLOAD.FAILURE_DIR)) {
  fs.mkdirSync(FILE_UPLOAD.FAILURE_DIR, { recursive: true });
}

/**
 * Write CSV File Manually
 * 
 * Why manual CSV writing?
 * - No external dependencies needed
 * - Simple format (3 columns)
 * - Full control over output
 * 
 * @param {string} filepath - Path to write CSV file
 * @param {Array} failures - Array of failure objects
 */
const writeCSV = (filepath, failures) => {
  // CSV Header
  const header = 'rowNumber,sku,reason\n';
  
  // CSV Rows
  const rows = failures.map(failure => {
    // Escape reason field (handle commas and quotes)
    const escapedReason = failure.reason
      .replace(/"/g, '""')  // Escape quotes by doubling them
      .replace(/\n/g, ' ');  // Replace newlines with spaces
    
    // If reason contains comma, wrap in quotes
    const reasonField = failure.reason.includes(',') 
      ? `"${escapedReason}"`
      : escapedReason;
    
    return `${failure.rowNumber},${failure.sku},${reasonField}`;
  }).join('\n');
  
  // Write to file
  fs.writeFileSync(filepath, header + rows, 'utf8');
};

/**
 * Export Family Failures to CSV
 * 
 * Format (from PDF):
 * rowNumber,sku,reason
 * 12,SKU-10099,Family code FAM_UNKNOWN does not exist
 * 18,SKU-10102,Invalid EAN format
 * 
 * @param {Array} failures - Array of failure objects
 * @returns {Promise<string|null>} - Path to failure CSV file or null if no failures
 */
const exportFamilyFailures = async (failures) => {
  if (!failures || failures.length === 0) {
    logger.info('No family failures to export', {
      event: 'failure_export_skipped',
      fileType: 'families',
    });
    return null;
  }

  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `families_failures_${timestamp}.csv`;
    const filepath = path.join(FILE_UPLOAD.FAILURE_DIR, filename);

    writeCSV(filepath, failures);

    logger.info('Family failures exported successfully', {
      event: 'failure_export_success',
      fileType: 'families',
      failureCount: failures.length,
      filepath,
    });

    return filepath;
  } catch (error) {
    logger.error('Failed to export family failures', {
      event: 'failure_export_error',
      fileType: 'families',
      error: error.message,
      stack: error.stack,
    });
    throw error;
  }
};

/**
 * Export Product Failures to CSV
 * 
 * Format (from PDF):
 * rowNumber,sku,reason
 * 12,SKU-10099,Family code FAM_UNKNOWN does not exist
 * 18,SKU-10102,Invalid EAN format
 * 
 * @param {Array} failures - Array of failure objects
 * @returns {Promise<string|null>} - Path to failure CSV file or null if no failures
 */
const exportProductFailures = async (failures) => {
  if (!failures || failures.length === 0) {
    logger.info('No product failures to export', {
      event: 'failure_export_skipped',
      fileType: 'products',
    });
    return null;
  }

  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `products_failures_${timestamp}.csv`;
    const filepath = path.join(FILE_UPLOAD.FAILURE_DIR, filename);

    writeCSV(filepath, failures);

    logger.info('Product failures exported successfully', {
      event: 'failure_export_success',
      fileType: 'products',
      failureCount: failures.length,
      filepath,
    });

    return filepath;
  } catch (error) {
    logger.error('Failed to export product failures', {
      event: 'failure_export_error',
      fileType: 'products',
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