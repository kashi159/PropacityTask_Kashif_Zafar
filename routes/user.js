const express = require('express');
const router = express.Router();

const loginController = require('../controller/user');
const userAuthenticate = require('../middleware/auth')
const signupController = require('../controller/user');
const folderController = require('../controller/folder')

router.post('/user/signup', signupController.postSignUpUser);
router.post('/user/login', loginController.postLoginUser);
router.get('/user/folders', userAuthenticate.authenticate, folderController.getFolders)
router.get('/user/folders/:folderId/subfolders', userAuthenticate.authenticate, folderController.getSubFolders)

module.exports = router;