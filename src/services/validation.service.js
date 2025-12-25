const { familySchema, productSchema } = require("../utils/schemas");

const validateFamily = (familyData) => {
    const { error, value } = familySchema.validate(familyData, {
        abortEarly: false,
    });

    if (error) {
        const errors = error.details.map((detail) => detail.message);
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
        const errors = error.details.map((detail) => detail.message);
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

module.exports = {
    validateFamily,
    validateProduct,
};
