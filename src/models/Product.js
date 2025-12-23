const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { VALIDATION_RULES } = require('../utils/constants');

/**
 * Product Model
 *
 * Represents a sellable product
 *
 * Business Rules Enforced:
 * - SKU must be unique
 * - Product must belong to exactly ONE family
 * - No orphan products allowed (must reference existing family)
 * - EAN/UPC must be 8-14 digits
 * - Vehicle Type is optional
 *
 * Relationship:
 * - Product belongs to Family (Many-to-One)
 * - Family has many Products (One-to-Many)
 */

const Product = sequelize.define(
  'Product',
  {
    // Primary Key
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },

    // SKU (Stock Keeping Unit) - Unique identifier
    sku: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: {
        msg: 'SKU must be unique',
      },
      validate: {
        notEmpty: {
          msg: 'SKU is required',
        },
        isValidSKU(value) {
          if (!VALIDATION_RULES.SKU_PATTERN.test(value)) {
            throw new Error('SKU must match pattern: SKU-xxxxx');
          }
        },
      },
      comment: 'Unique product identifier',
    },

    // Product Name
    name: {
      type: DataTypes.STRING(200),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Product name is required',
        },
        len: {
          args: [3, 200],
          msg: 'Product name must be between 3 and 200 characters',
        },
      },
      comment: 'Product name/description',
    },

    // EAN/UPC (Barcode)
    eanUpc: {
      type: DataTypes.STRING(14),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'EAN/UPC is required',
        },
        isNumeric: {
          msg: 'EAN/UPC must contain only numbers',
        },
        len: {
          args: [VALIDATION_RULES.EAN_UPC_LENGTH.min, VALIDATION_RULES.EAN_UPC_LENGTH.max],
          msg: `EAN/UPC must be between ${VALIDATION_RULES.EAN_UPC_LENGTH.min} and ${VALIDATION_RULES.EAN_UPC_LENGTH.max} digits`,
        },
      },
      comment: 'Product barcode (8-14 digits)',
    },

    // Vehicle Type (Optional)
    vehicleType: {
      type: DataTypes.STRING(50),
      allowNull: true, // Optional field
      validate: {
        len: {
          args: [0, 50],
          msg: 'Vehicle type must not exceed 50 characters',
        },
      },
      comment: 'Compatible vehicle type (optional)',
    },

    // Foreign Key to Family
    familyCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      references: {
        model: 'families', // References the families table
        key: 'familyCode', // References familyCode column
      },
      onUpdate: 'CASCADE', // If family code changes, update products
      onDelete: 'RESTRICT', // Prevent deleting family if products exist
      validate: {
        notEmpty: {
          msg: 'Family code is required',
        },
      },
      comment: 'Reference to parent family',
    },
  },
  {
    tableName: 'products',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['sku'],
      },
      {
        fields: ['familyCode'], // Fast joins with families
      },
      {
        fields: ['name'], // Search by name
      },
      {
        fields: ['eanUpc'], // Search by barcode
      },
    ],
  },
);

/**
 * Why these foreign key options?
 *
 * onUpdate: 'CASCADE'
 * - If family code changes from FAM_001 to FAM_002
 * - All products automatically update to FAM_002
 * - Maintains referential integrity
 *
 * onDelete: 'RESTRICT'
 * - Cannot delete a family if products exist
 * - Prevents orphan products
 * - Business rule: "No orphan products allowed"
 *
 * Example:
 * Family: FAM_WIPERS_001
 * Products: SKU-10001, SKU-10002, SKU-10003
 *
 * Try to delete family → ERROR: Products still reference it
 * Must delete products first, then family
 */

module.exports = Product;
