const Family = require('./Family');
const Product = require('./Product');

/**
 * Define Model Relationships
 *
 * Why define relationships?
 * - Enables JOIN queries
 * - Automatic eager loading
 * - Cascade operations
 * - Data integrity
 *
 * Relationship Type: One-to-Many
 * - One Family has many Products
 * - One Product belongs to one Family
 */

// Family has many Products
Family.hasMany(Product, {
  foreignKey: 'familyCode', // Column in Product table
  sourceKey: 'familyCode', // Column in Family table
  as: 'products', // Alias for accessing products
  onDelete: 'RESTRICT', // Can't delete family if products exist
  onUpdate: 'CASCADE', // Update products if family code changes
});

// Product belongs to Family
Product.belongsTo(Family, {
  foreignKey: 'familyCode', // Column in Product table
  targetKey: 'familyCode', // Column in Family table
  as: 'family', // Alias for accessing family
});

/**
 * What these relationships enable:
 *
 * 1. Eager Loading (Include related data):
 * const products = await Product.findAll({
 *   include: [{ model: Family, as: 'family' }]
 * });
 * // Returns products with family data in one query
 *
 * 2. Reverse Loading:
 * const family = await Family.findOne({
 *   where: { familyCode: 'FAM_WIPERS_001' },
 *   include: [{ model: Product, as: 'products' }]
 * });
 * // Returns family with all its products
 *
 * 3. Automatic Validation:
 * await Product.create({
 *   sku: 'SKU-10001',
 *   familyCode: 'NONEXISTENT'
 * });
 * // ERROR: Foreign key constraint fails
 */

module.exports = {
  Family,
  Product,
};
