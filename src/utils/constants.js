/**
 * Application Constants
 * 
 * Why centralize constants?
 * - Single source of truth
 * - Easy to update
 * - Prevents typos
 * - Self-documenting code
 */

const FAMILY_STATUS = {
    ACTIVE: 'ACTIVE',
    INACTIVE: 'INACTIVE',
  };
  
  const PRODUCT_LINES = {
    WIPERS: 'WIPERS',
    FILTRATION: 'FILTRATION',
    ENGINE_COOLING: 'ENGINE COOLING',
  };
  
  const BRANDS = {
    VALEO: 'VALEO',
    // Add more brands as needed
  };
  
  const VALIDATION_RULES = {
    EAN_UPC_LENGTH: { min: 8, max: 14 },
    FAMILY_CODE_PATTERN: /^FAM_[A-Z_]+_\d{3}$/,
    SKU_PATTERN: /^SKU-\d+$/,
  };
  
  const FILE_UPLOAD = {
    MAX_SIZE: parseInt(process.env.MAX_FILE_SIZE, 10) || 5242880, // 5MB
    ALLOWED_TYPES: ['text/csv', 'application/vnd.ms-excel'],
    UPLOAD_DIR: process.env.UPLOAD_DIR || './uploads',
    FAILURE_DIR: process.env.FAILURE_DIR || './failures',
  };
  
  module.exports = {
    FAMILY_STATUS,
    PRODUCT_LINES,
    BRANDS,
    VALIDATION_RULES,
    FILE_UPLOAD,
  };