const requestLogger = require("./requestLogger.middleware");
const errorHandler = require("./errorHandler.middleware");
const notFound = require("./notFound.middleware");
const { uploadFiles, cleanupFiles } = require("./fileUpload.middleware");

module.exports = {
    requestLogger,
    errorHandler,
    notFound,
    uploadFiles,
    cleanupFiles,
};
