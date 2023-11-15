const express = require('express');
const router = express.Router();

const folderController = require('../controller/folder');
const userAuthenticate = require('../middleware/auth')


router.post('/folder/createfolder', userAuthenticate.authenticate, folderController.postFolder);
router.post('/folder/createsubfolder', userAuthenticate.authenticate, folderController.postSubFolder);
router.put('/folder/renamefile/:fileId', userAuthenticate.authenticate, folderController.renameFile);
router.post('/folder/movefile/:fileId', userAuthenticate.authenticate, folderController.moveFile);
router.delete('/folder/deletefile/:fileId', userAuthenticate.authenticate, folderController.deleteFile);


module.exports = router;