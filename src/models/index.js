const Family = require("./Family");
const Product = require("./Product");

// Define associations
Family.hasMany(Product, {
    foreignKey: "familyCode",
    sourceKey: "familyCode",
    as: "products",
});

Product.belongsTo(Family, {
    foreignKey: "familyCode",
    targetKey: "familyCode",
    as: "family",
});

// Export models
module.exports = {
    Family,
    Product,
};
