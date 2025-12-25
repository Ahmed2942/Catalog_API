const fs = require("fs");
const csv = require("csv-parser");
const { CSV_COLUMNS } = require("../utils/constants");
const logger = require("../config/logger");

// CSV Parser Service

// Parse Families CSV
const parseFamiliesCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const families = [];
        let rowNumber = 0;
        const startTime = Date.now();

        logger.info("Starting to parse families CSV", {
            event: "csv_parse_start",
            fileType: "families",
            filePath,
        });

        fs.createReadStream(filePath)
            .pipe(csv({ separator: ";" }))
            .on("data", (row) => {
                rowNumber++;
                families.push({
                    rowNumber,
                    familyCode: row[CSV_COLUMNS.FAMILY.FAMILY_CODE]?.trim(),
                    familyName: row[CSV_COLUMNS.FAMILY.FAMILY_NAME]?.trim(),
                    productLine: row[CSV_COLUMNS.FAMILY.PRODUCT_LINE]?.trim(),
                    brand: row[CSV_COLUMNS.FAMILY.BRAND]?.trim(),
                    status: row[CSV_COLUMNS.FAMILY.STATUS]?.trim(),
                });
            })
            .on("end", () => {
                const duration = Date.now() - startTime;
                logger.info("Families CSV parsed successfully", {
                    event: "csv_parse_end",
                    fileType: "families",
                    rowCount: families.length,
                    duration: `${duration}ms`,
                });
                resolve(families);
            })
            .on("error", (error) => {
                logger.error("Failed to parse families CSV", {
                    event: "csv_parse_error",
                    fileType: "families",
                    error: error.message,
                    stack: error.stack,
                });
                reject(error);
            });
    });
};

// Parse Products CSV
const parseProductsCSV = (filePath) => {
    return new Promise((resolve, reject) => {
        const products = [];
        let rowNumber = 0;
        const startTime = Date.now();

        logger.info("Starting to parse products CSV", {
            event: "csv_parse_start",
            fileType: "products",
            filePath,
        });

        fs.createReadStream(filePath)
            .pipe(csv({ separator: ";" }))
            .on("data", (row) => {
                rowNumber++;
                products.push({
                    rowNumber,
                    sku: row[CSV_COLUMNS.PRODUCT.SKU]?.trim(),
                    name: row[CSV_COLUMNS.PRODUCT.NAME]?.trim(),
                    familyCode: row[CSV_COLUMNS.PRODUCT.FAMILY_CODE]?.trim(),
                    eanUpc: row[CSV_COLUMNS.PRODUCT.EAN_UPC]?.trim(),
                    vehicleType: row[CSV_COLUMNS.PRODUCT.VEHICLE_TYPE]?.trim() || null,
                });
            })
            .on("end", () => {
                const duration = Date.now() - startTime;
                logger.info("Products CSV parsed successfully", {
                    event: "csv_parse_end",
                    fileType: "products",
                    rowCount: products.length,
                    duration: `${duration}ms`,
                });
                resolve(products);
            })
            .on("error", (error) => {
                logger.error("Failed to parse products CSV", {
                    event: "csv_parse_error",
                    fileType: "products",
                    error: error.message,
                    stack: error.stack,
                });
                reject(error);
            });
    });
};

module.exports = {
    parseFamiliesCSV,
    parseProductsCSV,
};
