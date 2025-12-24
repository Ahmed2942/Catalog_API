const { familySchema, productSchema } = require('../utils/schemas');
const { ERROR_MESSAGES } = require('../utils/constants');
const { Family, Product } = require('../models');
const logger = require('../config/logger');

const validateFamily = (familyData) => {
  const { error, value } = familySchema.validate(familyData, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((detail) => detail.message).join('; ');
    return {
      isValid: false,
      errors,
      data: null,
    };
  }

  return {
    isValid: true,
    errors: null,
    data: value,
  };
};

const validateProduct = (productData) => {
  const { error, value } = productSchema.validate(productData, {
    abortEarly: false,
  });

  if (error) {
    const errors = error.details.map((detail) => detail.message).join('; ');
    return {
      isValid: false,
      errors,
      data: null,
    };
  }

  return {
    isValid: true,
    errors: null,
    data: value,
  };
};

const checkFamilyExists = async (familyCode) => {
  try {
    const family = await Family.findByPk(familyCode);
    return family !== null;
  } catch (error) {
    logger.error('Error checking family existence', {
      familyCode,
      error: error.message,
    });
    throw error;
  }
};

const checkProductExists = async (sku) => {
  try {
    const product = await Product.findByPk(sku);
    return product !== null;
  } catch (error) {
    logger.error('Error checking product existence', {
      sku,
      error: error.message,
    });
    throw error;
  }
};

const validateFamilyForImport = async (familyData, isUpdate = false) => {
  const validation = validateFamily(familyData);

  if (!validation.isValid) {
    return {
      isValid: false,
      errors: validation.errors,
    };
  }

  if (!isUpdate) {
    const exists = await checkFamilyExists(familyData.familyCode);
    if (exists) {
      return {
        isValid: false,
        errors: ERROR_MESSAGES.DUPLICATE_FAMILY_CODE,
      };
    }
  }

  return {
    isValid: true,
    errors: null,
  };
};

const validateProductForImport = async (productData, isUpdate = false) => {
  const validation = validateProduct(productData);

  if (!validation.isValid) {
    return {
      isValid: false,
      errors: validation.errors,
    };
  }

  const familyExists = await checkFamilyExists(productData.familyCode);
  if (!familyExists) {
    return {
      isValid: false,
      errors: `${ERROR_MESSAGES.FAMILY_NOT_FOUND}: ${productData.familyCode}`,
    };
  }

  if (!isUpdate) {
    const productExists = await checkProductExists(productData.sku);
    if (productExists) {
      return {
        isValid: false,
        errors: ERROR_MESSAGES.DUPLICATE_SKU,
      };
    }
  }

  return {
    isValid: true,
    errors: null,
  };
};

module.exports = {
  validateFamily,
  validateProduct,
  validateFamilyForImport,
  validateProductForImport,
  checkFamilyExists,
  checkProductExists,
};
