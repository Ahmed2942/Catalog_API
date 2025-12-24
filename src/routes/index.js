const express = require('express');
const healthRoutes = require('./health.routes');
const importRoutes = require('./import.routes');
const searchRoutes = require('./search.routes');

const router = express.Router();

router.use('/health', healthRoutes);
router.use('/import', importRoutes);
router.use('/search', searchRoutes);

module.exports = router;
