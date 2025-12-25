const Joi = require("joi");
const { FAMILY_STATUS, VALIDATION_RULES } = require("./constants");

const familySchema = Joi.object({
    rowNumber: Joi.number().required(),
    familyCode: Joi.string()
        .trim()
        .pattern(VALIDATION_RULES.FAMILY_CODE_PATTERN)
        .required()
        .messages({
            "string.base": "Family Code must be a string",
            "string.pattern.base": "Family Code must match pattern (e.g., FAM_WIPERS_001)",
            "any.required": "Family Code is required",
            "string.empty": "Family Code cannot be empty",
        }),
    familyName: Joi.string().trim().required().messages({
        "string.base": "Family Name must be a string",
        "any.required": "Family Name is required",
        "string.empty": "Family Name cannot be empty",
    }),
    productLine: Joi.string().trim().required().messages({
        "string.base": "Product Line must be a string",
        "any.required": "Product Line is required",
        "string.empty": "Product Line cannot be empty",
    }),
    brand: Joi.string().trim().required().messages({
        "string.base": "Brand must be a string",
        "any.required": "Brand is required",
        "string.empty": "Brand cannot be empty",
    }),
    status: Joi.string()
        .trim()
        .valid(FAMILY_STATUS.ACTIVE, FAMILY_STATUS.INACTIVE)
        .required()
        .messages({
            "string.base": "Status must be a string",
            "any.only": "Status must be either ACTIVE or INACTIVE",
            "any.required": "Status is required",
            "string.empty": "Status cannot be empty",
        }),
});

const productSchema = Joi.object({
    rowNumber: Joi.number().required(),
    sku: Joi.string().trim().pattern(VALIDATION_RULES.SKU_PATTERN).required().messages({
        "any.required": "SKU is required",
        "string.base": "SKU must be a string",
        "string.empty": "SKU cannot be empty",
        "string.pattern.base": "SKU must match pattern (e.g., SKU-12345)",
    }),
    name: Joi.string().trim().required().messages({
        "string.base": "Product Name must be a string",
        "any.required": "Product Name is required",
        "string.empty": "Product Name cannot be empty",
    }),
    familyCode: Joi.string().trim().required().messages({
        "string.base": "Family Code must be a string",
        "any.required": "Family Code is required",
        "string.empty": "Family Code cannot be empty",
    }),
    eanUpc: Joi.string()
        .trim()
        .pattern(VALIDATION_RULES.EAN_UPC_PATTERN)
        .required()
        .min(VALIDATION_RULES.EAN_UPC_LENGTH.min)
        .max(VALIDATION_RULES.EAN_UPC_LENGTH.max)
        .messages({
            "string.base": "EAN UPC must be a string",
            "string.pattern.base": "EAN UPC must be 8-14 digits",
            "any.required": "EAN UPC is required",
        }),
    vehicleType: Joi.string().trim().allow(null, "").optional().messages({
        "string.base": "Vehicle Type must be a string",
    }),
});

module.exports = {
    familySchema,
    productSchema,
};
