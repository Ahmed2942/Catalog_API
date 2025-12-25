const { Family, Product } = require("../models");
const { validateFamily, validateProduct } = require("./validation.service");
const { exportFamilyFailures, exportProductFailures } = require("./failure.service");
const logger = require("../config/logger");
const { IMPORT_STATS, IMPORT_OPERATIONS } = require("../utils/constants");

// Process Import
const processImport = async (familiesData, productsData) => {
    const startTime = Date.now();

    const stats = {
        [IMPORT_STATS.FAMILIES_PROCESSED]: 0,
        [IMPORT_STATS.FAMILIES_INSERTED]: 0,
        [IMPORT_STATS.FAMILIES_UPDATED]: 0,
        [IMPORT_STATS.FAMILIES_FAILED]: 0,
        [IMPORT_STATS.PRODUCTS_PROCESSED]: 0,
        [IMPORT_STATS.PRODUCTS_INSERTED]: 0,
        [IMPORT_STATS.PRODUCTS_UPDATED]: 0,
        [IMPORT_STATS.PRODUCTS_FAILED]: 0,
    };

    const familyFailures = [];
    const productFailures = [];

    try {
        // Log import start
        logger.logImportStart({
            familiesCount: familiesData.length,
            productsCount: productsData.length,
            timestamp: new Date().toISOString(),
        });

        // Import Families
        const familyStartTime = Date.now();

        for (const familyData of familiesData) {
            stats[IMPORT_STATS.FAMILIES_PROCESSED]++;
            const validation = validateFamily(familyData);
            if (!validation.isValid) {
                stats[IMPORT_STATS.FAMILIES_FAILED]++;
                familyFailures.push({
                    rowNumber: familyData.rowNumber,
                    familyCode: familyData.familyCode,
                    reason: validation.errors.join("--"),
                });

                // Log warnings for validation failures
                logger.logImportWarning("Family validation failed", {
                    rowNumber: familyData.rowNumber,
                    familyCode: familyData.familyCode,
                    errors: validation.errors,
                });
                continue;
            }

            try {
                const [family, created] = await Family.upsert({
                    familyCode: familyData.familyCode,
                    familyName: familyData.familyName,
                    productLine: familyData.productLine,
                    brand: familyData.brand,
                    status: familyData.status,
                });

                if (created) {
                    stats[IMPORT_STATS.FAMILIES_INSERTED]++;
                    logger.logRowProcessing(
                        "families",
                        familyData.rowNumber,
                        IMPORT_OPERATIONS.INSERT,
                        {
                            familyCode: familyData.familyCode,
                        },
                    );
                } else {
                    stats[IMPORT_STATS.FAMILIES_UPDATED]++;
                    logger.logRowProcessing(
                        "families",
                        familyData.rowNumber,
                        IMPORT_OPERATIONS.UPDATE,
                        {
                            familyCode: familyData.familyCode,
                        },
                    );
                }
            } catch (error) {
                stats[IMPORT_STATS.FAMILIES_FAILED]++;
                familyFailures.push({
                    rowNumber: familyData.rowNumber,
                    familyCode: familyData.familyCode,
                    reason: error.message,
                });

                // Log errors
                logger.logImportError("Family import failed", {
                    rowNumber: familyData.rowNumber,
                    familyCode: familyData.familyCode,
                    error: error.message,
                });
            }
        }

        const familyDuration = Date.now() - familyStartTime;

        // Per-file summary
        logger.logFileSummary("families", {
            totalRows: familiesData.length,
            processed: stats[IMPORT_STATS.FAMILIES_PROCESSED],
            inserted: stats[IMPORT_STATS.FAMILIES_INSERTED],
            updated: stats[IMPORT_STATS.FAMILIES_UPDATED],
            failed: stats[IMPORT_STATS.FAMILIES_FAILED],
            duration: `${familyDuration}ms`,
            successRate:
                stats[IMPORT_STATS.FAMILIES_PROCESSED] > 0
                    ? `${(((stats[IMPORT_STATS.FAMILIES_PROCESSED] - stats[IMPORT_STATS.FAMILIES_FAILED]) / stats[IMPORT_STATS.FAMILIES_PROCESSED]) * 100).toFixed(2)}%`
                    : "0%",
        });

        // Import Products
        const productStartTime = Date.now();

        for (const productData of productsData) {
            stats[IMPORT_STATS.PRODUCTS_PROCESSED]++;
            const validation = validateProduct(productData);
            if (!validation.isValid) {
                stats[IMPORT_STATS.PRODUCTS_FAILED]++;
                productFailures.push({
                    rowNumber: productData.rowNumber,
                    sku: productData.sku,
                    reason: validation.errors.join("--"),
                });

                // Log warnings for validation failures
                logger.logImportWarning("Product validation failed", {
                    rowNumber: productData.rowNumber,
                    sku: productData.sku,
                    errors: validation.errors,
                });
                continue;
            }

            try {
                const [product, created] = await Product.upsert({
                    sku: productData.sku,
                    name: productData.name,
                    familyCode: productData.familyCode,
                    eanUpc: productData.eanUpc,
                    vehicleType: productData.vehicleType,
                });

                if (created) {
                    stats[IMPORT_STATS.PRODUCTS_INSERTED]++;
                    logger.logRowProcessing(
                        "products",
                        productData.rowNumber,
                        IMPORT_OPERATIONS.INSERT,
                        {
                            sku: productData.sku,
                        },
                    );
                } else {
                    stats[IMPORT_STATS.PRODUCTS_UPDATED]++;
                    logger.logRowProcessing(
                        "products",
                        productData.rowNumber,
                        IMPORT_OPERATIONS.UPDATE,
                        {
                            sku: productData.sku,
                        },
                    );
                }
            } catch (error) {
                stats[IMPORT_STATS.PRODUCTS_FAILED]++;
                productFailures.push({
                    rowNumber: productData.rowNumber,
                    sku: productData.sku,
                    reason: error.message,
                });

                // Log errors
                logger.logImportError("Product import failed", {
                    rowNumber: productData.rowNumber,
                    sku: productData.sku,
                    error: error.message,
                });
            }
        }

        const productDuration = Date.now() - productStartTime;

        // Per-file summary
        logger.logFileSummary("products", {
            totalRows: productsData.length,
            processed: stats[IMPORT_STATS.PRODUCTS_PROCESSED],
            inserted: stats[IMPORT_STATS.PRODUCTS_INSERTED],
            updated: stats[IMPORT_STATS.PRODUCTS_UPDATED],
            failed: stats[IMPORT_STATS.PRODUCTS_FAILED],
            duration: `${productDuration}ms`,
            successRate:
                stats[IMPORT_STATS.PRODUCTS_PROCESSED] > 0
                    ? `${(((stats[IMPORT_STATS.PRODUCTS_PROCESSED] - stats[IMPORT_STATS.PRODUCTS_FAILED]) / stats[IMPORT_STATS.PRODUCTS_PROCESSED]) * 100).toFixed(2)}%`
                    : "0%",
        });

        // Export FAILURES
        const familyFailuresFile = await exportFamilyFailures(familyFailures);
        const productFailuresFile = await exportProductFailures(productFailures);

        const totalDuration = Date.now() - startTime;

        // Log import end
        logger.logImportEnd({
            stats,
            duration: `${totalDuration}ms`,
            familyDuration: `${familyDuration}ms`,
            productDuration: `${productDuration}ms`,
            failureFiles: {
                families: familyFailuresFile,
                products: productFailuresFile,
            },
            timestamp: new Date().toISOString(),
        });

        return {
            stats,
            failureFiles: {
                families: familyFailuresFile,
                products: productFailuresFile,
            },
            duration: totalDuration,
        };
    } catch (error) {
        // Log critical errors
        logger.logImportError("Import process failed critically", {
            error: error.message,
            stack: error.stack,
            stats,
            timestamp: new Date().toISOString(),
        });

        throw error;
    }
};

module.exports = {
    processImport,
};
