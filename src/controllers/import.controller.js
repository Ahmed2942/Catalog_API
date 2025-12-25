const { parseFamiliesCSV, parseProductsCSV } = require("../services/csvParser.service");
const { processImport } = require("../services/import.service");
const { cleanupFiles } = require("../middleware/fileUpload.middleware");
const { ERROR_MESSAGES, FILE_FIELDS } = require("../utils/constants");
const logger = require("../config/logger");

const importController = {
    async import(req, res, next) {
        const startTime = Date.now();

        try {
            logger.info("Import request received");

            if (!req.files) {
                return res.status(400).json({
                    success: false,
                    error: ERROR_MESSAGES.NO_FILES,
                });
            }

            const familiesFile = req.files[FILE_FIELDS.FAMILIES]?.[0];
            const productsFile = req.files[FILE_FIELDS.PRODUCTS]?.[0];

            if (!familiesFile) {
                cleanupFiles(req.files);
                return res.status(400).json({
                    success: false,
                    error: ERROR_MESSAGES.MISSING_FAMILIES_FILE,
                });
            }

            if (!productsFile) {
                cleanupFiles(req.files);
                return res.status(400).json({
                    success: false,
                    error: ERROR_MESSAGES.MISSING_PRODUCTS_FILE,
                });
            }

            logger.info("Files received", {
                familiesFile: familiesFile.originalname,
                productsFile: productsFile.originalname,
            });

            const familiesData = await parseFamiliesCSV(familiesFile.path);
            const productsData = await parseProductsCSV(productsFile.path);

            const result = await processImport(familiesData, productsData);

            cleanupFiles(req.files);

            const duration = Date.now() - startTime;
            logger.info("Import request completed", { duration: `${duration}ms` });

            return res.status(200).json({
                success: true,
                message: "Import completed",
                stats: result.stats,
                failureFiles: result.failureFiles,
                duration: result.duration,
            });
        } catch (error) {
            logger.error("Import request failed", { error: error.message });
            cleanupFiles(req.files);
            next(error);
        }
    },
};

module.exports = importController;
