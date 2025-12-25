const { searchProducts } = require("../services/search.service");
const logger = require("../config/logger");
const { HTTP_STATUS, ERROR_MESSAGES } = require("../utils/constants");

const search = async (req, res) => {
    try {
        const { familyCode, productLine, brand, sku, name, status, page, limit } = req.query;

        // Build filters object
        const filters = {};
        if (familyCode) filters.familyCode = familyCode;
        if (productLine) filters.productLine = productLine;
        if (brand) filters.brand = brand;
        if (sku) filters.sku = sku;
        if (name) filters.name = name;
        if (status) filters.status = status;

        // Build pagination object
        const pagination = {};
        if (page) pagination.page = page;
        if (limit) pagination.limit = limit;

        const result = await searchProducts(filters, pagination);

        return res.status(HTTP_STATUS.OK).json({
            success: true,
            ...result,
        });
    } catch (error) {
        logger.error("Search request failed", { error: error.message });
        return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
            success: false,
            error: ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
            message: error.message,
        });
    }
};

module.exports = {
    search,
};
