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
router.post('/forgot-password', authController.requestReset);
router.post('/logout', authController.logout);
router.post('/users/:userId/payment', authController.PaymentController);
router.put('/payment/:userId', authController.updatePaymentInfo);
router.put('/users/:userID', authController.updateUserDetails);
router.get('/verify-email/:token', authController.verifyEmail);
router.get('/users/:email', authController.getUserByEmailController);
router.post('/reset-password', authController.updatePassword);
module.exports = router;
