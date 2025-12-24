const { VALIDATION_RULES } = require('./constants');

/**
 * Reusable Validation Utilities
 *
 * Why separate validators?
 * - Pure functions (no side effects)
 * - Reusable across services
 * - Easy to test
 * - No business logic (just validation)
 *
 * Utils vs Services:
 * - Utils: Generic, reusable, no DB access
 * - Services: Business logic, DB access, orchestration
 */

/**
 * Validate SKU format
 *
 * Pattern: SKU-xxxxx (5+ alphanumeric characters after dash)
 * Examples: SKU-10001, SKU-ABC123
 *
 * @param {string} sku - SKU to validate
 * @returns {boolean} True if valid
 */
const isValidSKU = (sku) => {
  if (!sku || typeof sku !== 'string') {
    return false;
  }
  return VALIDATION_RULES.SKU_PATTERN.test(sku.trim());
};

/**
 * Validate Family Code format
 *
 * Pattern: FAM_XXX_001
 * Examples: FAM_WIPERS_001, FAM_FILTER_002
 *
 * @param {string} familyCode - Family code to validate
 * @returns {boolean} True if valid
 */
const isValidFamilyCode = (familyCode) => {
  if (!familyCode || typeof familyCode !== 'string') {
    return false;
  }
  return VALIDATION_RULES.FAMILY_CODE_PATTERN.test(familyCode.trim());
};

/**
 * Validate EAN/UPC format
 *
 * Rules:
 * - Must be numeric
 * - Length: 8-14 digits
 *
 * @param {string} eanUpc - EAN/UPC to validate
 * @returns {boolean} True if valid
 */
const isValidEanUpc = (eanUpc) => {
  if (!eanUpc || typeof eanUpc !== 'string') {
    return false;
  }

  const trimmed = eanUpc.trim();

  // Check if numeric
  if (!/^\d+$/.test(trimmed)) {
    return false;
  }

  // Check length
  const length = trimmed.length;
  return (
    length >= VALIDATION_RULES.EAN_UPC_LENGTH.min && length <= VALIDATION_RULES.EAN_UPC_LENGTH.max
  );
};

/**
 * Validate Product Line
 *
 * Must be one of the allowed product lines
 *
 * @param {string} productLine - Product line to validate
 * @param {string[]} allowedLines - Array of allowed product lines
 * @returns {boolean} True if valid
 */
const isValidProductLine = (productLine, allowedLines) => {
  if (!productLine || typeof productLine !== 'string') {
    return false;
  }
  return allowedLines.includes(productLine.trim().toUpperCase());
};

/**
 * Validate Status
 *
 * Must be ACTIVE or INACTIVE
 *
 * @param {string} status - Status to validate
 * @param {string[]} allowedStatuses - Array of allowed statuses
 * @returns {boolean} True if valid
 */
const isValidStatus = (status, allowedStatuses) => {
  if (!status || typeof status !== 'string') {
    return false;
  }
  return allowedStatuses.includes(status.trim().toUpperCase());
};

/**
 * Sanitize string
 *
 * Removes leading/trailing whitespace
 * Handles null/undefined
 *
 * @param {string} value - String to sanitize
 * @returns {string|null} Sanitized string or null
 */
const sanitizeString = (value) => {
  if (value === null || value === undefined) {
    return null;
  }
  if (typeof value !== 'string') {
    return String(value).trim();
  }
  return value.trim();
};

/**
 * Check if string is empty
 *
 * Considers null, undefined, and whitespace-only as empty
 *
 * @param {string} value - String to check
 * @returns {boolean} True if empty
 */
const isEmpty = (value) => {
  if (value === null || value === undefined) {
    return true;
  }
  if (typeof value !== 'string') {
    return false;
  }
  return value.trim().length === 0;
};

/**
 * Validate required field
 *
 * Checks if field exists and is not empty
 *
 * @param {any} value - Value to check
 * @param {string} fieldName - Field name for error message
 * @returns {object} { valid: boolean, error: string|null }
 */
const validateRequired = (value, fieldName) => {
  if (isEmpty(value)) {
    return {
      valid: false,
      error: `${fieldName} is required`,
    };
  }
  return { valid: true, error: null };
};

/**
 * Validate string length
 *
 * @param {string} value - String to validate
 * @param {number} min - Minimum length
 * @param {number} max - Maximum length
 * @param {string} fieldName - Field name for error message
 * @returns {object} { valid: boolean, error: string|null }
 */
const validateLength = (value, min, max, fieldName) => {
  if (!value || typeof value !== 'string') {
    return {
      valid: false,
      error: `${fieldName} must be a string`,
    };
  }

  const length = value.trim().length;

  if (length < min || length > max) {
    return {
      valid: false,
      error: `${fieldName} must be between ${min} and ${max} characters`,
    };
  }

  return { valid: true, error: null };
};

module.exports = {
  isValidSKU,
  isValidFamilyCode,
  isValidEanUpc,
  isValidProductLine,
  isValidStatus,
  sanitizeString,
  isEmpty,
  validateRequired,
  validateLength,
};
