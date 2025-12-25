const { DataTypes } = require("sequelize");
const { sequelize } = require("../config/database");
const { FAMILY_STATUS } = require("../utils/constants");

/**
 * Family Model
 *
 */

const Family = sequelize.define(
    "Family",
    {
        // Family Code (Unique identifier)
        familyCode: {
            type: DataTypes.STRING(50),
            primaryKey: true,
            validate: {
                notEmpty: {
                    msg: "Family code is required",
                },
            },
        },

        // Family Name
        familyName: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Family name is required",
                },
            },
        },

        // Product Line (e.g., WIPERS, FILTRATION)
        productLine: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Product line name is required",
                },
            },
        },

        // Brand
        brand: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Brand is required",
                },
            },
        },

        // Status (ACTIVE/INACTIVE)
        status: {
            type: DataTypes.ENUM(...Object.values(FAMILY_STATUS)),
            allowNull: false,
            validate: {
                notEmpty: {
                    msg: "Status is required",
                },
                isIn: {
                    args: [Object.values(FAMILY_STATUS)],
                    msg: `Status must be either ${FAMILY_STATUS.ACTIVE} or ${FAMILY_STATUS.INACTIVE}`,
                },
            },
        },
    },
    {
        // Model options
        tableName: "families",
        timestamps: true, // Adds createdAt, updatedAt
        indexes: [
            {
                fields: ["familyCode"], // Index for fast lookups
            },
        ],
    },
);

module.exports = Family;
