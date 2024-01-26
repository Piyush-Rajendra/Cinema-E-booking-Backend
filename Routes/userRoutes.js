// authRoutes.js

const express = require('express');
const authController = require('../controllers/userController');
const multer = require('multer');

const router = express.Router();
const upload = multer();

router.post('/signup', upload.none(), authController.signUp);
router.post('/signin', upload.none(), authController.signIn);
router.get('/user/:username', authController.getUserByUsername);
router.get('/users', authController.getAllUsers);

module.exports = router;
