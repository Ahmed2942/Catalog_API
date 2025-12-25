require("dotenv").config();

/**
 * Family Status Enum
 */
const FAMILY_STATUS = {
    ACTIVE: "ACTIVE",
    INACTIVE: "INACTIVE",
};

/**
 * Validation Rules
 *
 * Why separate validation rules?
 * - Reusable across services
 * - Easy to modify
 * - Clear documentation
 */
const VALIDATION_RULES = {
    // SKU pattern: SKU-xxxxx (5 or more characters after dash)
    SKU_PATTERN: /^SKU-[0-9]+$/i,

    // Family code pattern: FAM_XXX_001
    FAMILY_CODE_PATTERN: /^FAM_[A-Z]+_\d{3}$/,

    // EAN/UPC pattern (8-14 digits only)
    EAN_UPC_PATTERN: /^\d{8,14}$/,

    // EAN/UPC length (8-14 digits)
    EAN_UPC_LENGTH: {
        min: 8,
        max: 14,
    },
};

/**
 * File Upload Configuration
 */
const DIRS = {
    // Upload directory
    UPLOAD_DIR: process.env.UPLOAD_DIR || "./uploads",

    // Failure export directory
    FAILURE_DIR: process.env.FAILURE_DIR || "./failures",

    // Log directory
    LOG_DIR: process.env.LOG_DIR || "./logs",
};

/**
 * File Upload Field Names
 */
const FILE_FIELDS = {
    FAMILIES: "familiesFile",
    PRODUCTS: "productsFile",
};

// CSV Column Names
const CSV_COLUMNS = {
    FAMILY: {
        FAMILY_CODE: "Family Code",
        FAMILY_NAME: "Family Name",
        PRODUCT_LINE: "Product Line",
        BRAND: "Brand",
        STATUS: "Status",
    },
    PRODUCT: {
        SKU: "SKU",
        NAME: "Name",
        FAMILY_CODE: "Family Code",
        EAN_UPC: "EAN UPC",
        VEHICLE_TYPE: "Vehicle Type",
    },
};

// Error Messages
const ERROR_MESSAGES = {
    // File upload errors
    NO_FILES: "No files uploaded",
    MISSING_FAMILIES_FILE: "families.csv file is required",
    MISSING_PRODUCTS_FILE: "products.csv file is required",
    FILE_TOO_LARGE: "File size exceeds maximum allowed size",
    INVALID_FILE_TYPE: "Only CSV files are allowed",

    // CSV format errors
    INVALID_CSV_FORMAT: "Invalid CSV format",
    MISSING_REQUIRED_COLUMNS: "Missing required columns in CSV",
    EMPTY_CSV_FILE: "CSV file is empty",

    // Validation errors
    INVALID_FAMILY_CODE: "Invalid family code format",
    INVALID_SKU: "Invalid SKU format",
    INVALID_EAN_UPC: "Invalid EAN/UPC format (must be 8-14 digits)",
    INVALID_STATUS: "Status must be either ACTIVE or INACTIVE",
    FAMILY_NOT_FOUND: "Referenced family does not exist",
    DUPLICATE_SKU: "SKU already exists",
    DUPLICATE_FAMILY_CODE: "Family code already exists",
    ORPHAN_PRODUCT: "Product cannot exist without a valid Family",

    // Required field errors
    FAMILY_CODE_REQUIRED: "Family Code is required",
    FAMILY_NAME_REQUIRED: "Family Name is required",
    PRODUCT_LINE_REQUIRED: "Product Line is required",
    BRAND_REQUIRED: "Brand is required",
    STATUS_REQUIRED: "Status is required",
    SKU_REQUIRED: "SKU is required",
    PRODUCT_NAME_REQUIRED: "Product Name is required",
    EAN_UPC_REQUIRED: "EAN UPC is required",

    // Import errors
    IMPORT_FAILED: "Import process failed",
    CSV_PARSE_ERROR: "Failed to parse CSV file",

    // Database errors
    DATABASE_ERROR: "Database operation failed",
    CONNECTION_ERROR: "Database connection failed",

    // General errors
    INTERNAL_SERVER_ERROR: "Internal server error",
    NOT_FOUND: "Resource not found",
};

/**
 * Success Messages
 */
const SUCCESS_MESSAGES = {
    IMPORT_COMPLETED: "Import completed successfully",
    FAMILY_CREATED: "Family created successfully",
    FAMILY_UPDATED: "Family updated successfully",
    PRODUCT_CREATED: "Product created successfully",
    PRODUCT_UPDATED: "Product updated successfully",
};

/**
 * Import Statistics Keys
 */
const IMPORT_STATS = {
    FAMILIES_PROCESSED: "familiesProcessed",
    FAMILIES_INSERTED: "familiesInserted",
    FAMILIES_UPDATED: "familiesUpdated",
    FAMILIES_FAILED: "familiesFailed",
    PRODUCTS_PROCESSED: "productsProcessed",
    PRODUCTS_INSERTED: "productsInserted",
    PRODUCTS_UPDATED: "productsUpdated",
    PRODUCTS_FAILED: "productsFailed",
};

/**
 * Import Operation Types
 * Used for tracking what operation was performed on each record
 */
const IMPORT_OPERATIONS = {
    INSERT: "INSERT",
    UPDATE: "UPDATE",
    SKIP: "SKIP",
    FAIL: "FAIL",
};

/**
 * Pagination Defaults
 */
const PAGINATION = {
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
    MAX_LIMIT: 100,
};

/**
 * HTTP Status Codes
 */
const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    UNPROCESSABLE_ENTITY: 422,
    INTERNAL_SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503,
};

/**
 * Log Levels
 */
const LOG_LEVELS = {
    ERROR: "error",
    WARN: "warn",
    INFO: "info",
    HTTP: "http",
    DEBUG: "debug",
};

/**
 * Environment Types
 */
const NODE_ENV = {
    DEVELOPMENT: "development",
    PRODUCTION: "production",
    TEST: "test",
};

/**
 * Failure Export File Names
 */
const FAILURE_FILES = {
    FAMILIES: "families_failures.csv",
    PRODUCTS: "products_failures.csv",
};

module.exports = {
    FAMILY_STATUS,
    VALIDATION_RULES,
    DIRS,
    FILE_FIELDS,
    CSV_COLUMNS,
    ERROR_MESSAGES,
    SUCCESS_MESSAGES,
    IMPORT_STATS,
    IMPORT_OPERATIONS,
    PAGINATION,
    HTTP_STATUS,
    LOG_LEVELS,
    NODE_ENV,
    FAILURE_FILES,
};
