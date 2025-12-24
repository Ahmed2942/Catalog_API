const express = require('express');
const importController = require('../controllers/import.controller');
const { uploadFiles } = require('../middleware/fileUpload.middleware');

const router = express.Router();

router.post('/', uploadFiles, importController.import);

module.exports = router;
