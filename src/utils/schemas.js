const Joi = require('joi');
const { FAMILY_STATUS, VALIDATION_RULES } = require('./constants');

const familySchema = Joi.object({
  rowNumber: Joi.number().required(),
  familyCode: Joi.string()
    .trim()
    .pattern(VALIDATION_RULES.FAMILY_CODE_PATTERN)
    .required()
    .messages({
      'string.pattern.base': 'Family Code must match pattern (e.g., FAM_WIPERS_001)',
      'any.required': 'Family Code is required',
    }),
  familyName: Joi.string().trim().min(1).max(100).required().messages({
    'any.required': 'Family Name is required',
    'string.empty': 'Family Name cannot be empty',
  }),
  productLine: Joi.string().trim().min(1).max(50).required().messages({
    'any.required': 'Product Line is required',
    'string.empty': 'Product Line cannot be empty',
  }),
  brand: Joi.string().trim().min(1).max(50).required().messages({
    'any.required': 'Brand is required',
    'string.empty': 'Brand cannot be empty',
  }),
  status: Joi.string().valid(FAMILY_STATUS.ACTIVE, FAMILY_STATUS.INACTIVE).required().messages({
    'any.only': 'Status must be either ACTIVE or INACTIVE',
    'any.required': 'Status is required',
  }),
});

const productSchema = Joi.object({
  rowNumber: Joi.number().required(),
  sku: Joi.string().trim().min(1).max(50).required().messages({
    'any.required': 'SKU is required',
    'string.empty': 'SKU cannot be empty',
  }),
  name: Joi.string().trim().min(1).max(200).required().messages({
    'any.required': 'Product Name is required',
    'string.empty': 'Product Name cannot be empty',
  }),
  familyCode: Joi.string().trim().required().messages({
    'any.required': 'Family Code is required',
    'string.empty': 'Family Code cannot be empty',
  }),
  eanUpc: Joi.string()
    .trim()
    .pattern(/^\d{8,14}$/)
    .required()
    .messages({
      'string.pattern.base': 'EAN UPC must be 8-14 digits',
      'any.required': 'EAN UPC is required',
    }),
  vehicleType: Joi.string().trim().max(50).allow(null, '').optional(),
});

module.exports = {
  familySchema,
  productSchema,
};
