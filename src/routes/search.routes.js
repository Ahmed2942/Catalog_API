const express = require('express');
const router = express.Router();
const { search } = require('../controllers/search.controller');

// GET /api/search
// Query parameters: familyCode, productLine, brand, sku, name, status, page, limit
router.get('/', search);

module.exports = router;
