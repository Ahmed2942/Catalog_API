const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { FAMILY_STATUS, PRODUCT_LINES } = require('../utils/constants');

/**
 * Family Model
 *
 * Represents a commercial product family (e.g., "Front Wipers Premium")
 *
 * Business Rules Enforced:
 * - Family Code must be unique
 * - All fields except status are required
 * - Product Line must be from predefined list
 * - Status defaults to ACTIVE
 *
 * Why Sequelize Model?
 * - Automatic validation
 * - Type safety
 * - Relationship management
 * - Query builder
 */

const Family = sequelize.define(
  'Family',
  {
    // Primary Key
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      comment: 'Auto-incrementing primary key',
    },

    // Family Code (Unique identifier)
    familyCode: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: {
        msg: 'Family code must be unique', // Custom error message
      },
      validate: {
        notEmpty: {
          msg: 'Family code cannot be empty',
        },
        // Custom validator for format
        isValidFormat(value) {
          if (!/^FAM_[A-Z_]+_\d{3}$/.test(value)) {
            throw new Error('Family code must match pattern: FAM_XXX_001');
          }
        },
      },
      comment: 'Unique family identifier (e.g., FAM_WIPERS_001)',
    },

    // Family Name
    familyName: {
      type: DataTypes.STRING(100),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Family name is required',
        },
        len: {
          args: [3, 100],
          msg: 'Family name must be between 3 and 100 characters',
        },
      },
      comment: 'Human-readable family name',
    },

    // Product Line (e.g., WIPERS, FILTRATION)
    productLine: {
      type: DataTypes.ENUM(...Object.values(PRODUCT_LINES)),
      allowNull: false,
      validate: {
        isIn: {
          args: [Object.values(PRODUCT_LINES)],
          msg: `Product line must be one of: ${Object.values(PRODUCT_LINES).join(', ')}`,
        },
      },
      comment: 'Product category',
    },

    // Brand
    brand: {
      type: DataTypes.STRING(50),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Brand is required',
        },
      },
      comment: 'Brand name (e.g., VALEO)',
    },

    // Status (ACTIVE/INACTIVE)
    status: {
      type: DataTypes.ENUM(...Object.values(FAMILY_STATUS)),
      allowNull: false,
      defaultValue: FAMILY_STATUS.ACTIVE,
      validate: {
        isIn: {
          args: [Object.values(FAMILY_STATUS)],
          msg: `Status must be either ${FAMILY_STATUS.ACTIVE} or ${FAMILY_STATUS.INACTIVE}`,
        },
      },
      comment: 'Family status',
    },
  },
  {
    // Model options
    tableName: 'families',
    timestamps: true, // Adds createdAt, updatedAt
    indexes: [
      {
        unique: true,
        fields: ['familyCode'], // Index for fast lookups
      },
      {
        fields: ['productLine'], // Index for filtering
      },
      {
        fields: ['status'], // Index for filtering
      },
    ],
  },
);

/**
 * Why these indexes?
 *
 * 1. familyCode (unique):
 *    - Fast lookups when importing products
 *    - Enforces uniqueness at DB level
 *
 * 2. productLine:
 *    - Search API filters by product line
 *    - Without index: Full table scan (slow)
 *    - With index: Direct lookup (fast)
 *
 * 3. status:
 *    - Search API filters by status
 *    - Common query pattern
 */

module.exports = Family;
