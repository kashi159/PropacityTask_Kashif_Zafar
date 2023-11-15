const express = require('express');
const router = express.Router();

const uploadController = require('../controller/upload');
const userAuthenticate = require('../middleware/auth')


router.post('/upload/file', userAuthenticate.authenticate, uploadController.uploadFile);
router.get('/uploads/files/:folderId', userAuthenticate.authenticate, uploadController.getFiles)

module.exports = router;