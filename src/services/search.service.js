const { Op } = require("sequelize");
const { Product, Family } = require("../models");
const logger = require("../config/logger");
const { PAGINATION } = require("../utils/constants");

const searchProducts = async (filters = {}, pagination = {}) => {
    try {
        const { familyCode, productLine, brand, sku, name, status } = filters;

        const { page = PAGINATION.DEFAULT_PAGE, limit = PAGINATION.DEFAULT_LIMIT } = pagination;

        // Validate and sanitize pagination
        const pageNumber = Math.max(1, parseInt(page, 10));
        const pageSize = Math.min(Math.max(1, parseInt(limit, 10)), PAGINATION.MAX_LIMIT);
        const offset = (pageNumber - 1) * pageSize;

        // Build WHERE clause for Product
        const productWhere = {};

        // Partial match for SKU
        if (sku) {
            productWhere.sku = {
                [Op.like]: `%${sku}%`,
            };
        }

        // Partial match for Product Name
        if (name) {
            productWhere.name = {
                [Op.like]: `%${name}%`,
            };
        }

        // Build WHERE clause for Family (via JOIN)
        const familyWhere = {};

        // Exact match for Family Code
        if (familyCode) {
            familyWhere.familyCode = familyCode;
        }

        // Exact match for Product Line
        if (productLine) {
            familyWhere.productLine = productLine;
        }

        // Exact match for Brand
        if (brand) {
            familyWhere.brand = brand;
        }

        // Exact match for Status
        if (status) {
            familyWhere.status = status;
        }

        logger.info("Search request", {
            filters,
            pagination: { page: pageNumber, limit: pageSize },
        });

        // Execute query with pagination
        const { count, rows } = await Product.findAndCountAll({
            where: productWhere,
            include: [
                {
                    model: Family,
                    as: "family",
                    where: familyWhere,
                    required: true, // INNER JOIN
                },
            ],
            limit: pageSize,
            offset,
            order: [["sku", "ASC"]], // Default ordering by SKU
            distinct: true, // For accurate count with joins
        });

        const totalPages = Math.ceil(count / pageSize);

        logger.info("Search completed", {
            totalResults: count,
            returnedResults: rows.length,
            page: pageNumber,
            totalPages,
        });

        return {
            data: rows,
            pagination: {
                currentPage: pageNumber,
                pageSize,
                totalResults: count,
                totalPages,
                hasNextPage: pageNumber < totalPages,
                hasPreviousPage: pageNumber > 1,
            },
        };
    } catch (error) {
        logger.error("Search failed", { error: error.message });
        throw error;
    }
};

module.exports = {
    searchProducts,
};
