// authRoutes.js

const express = require('express');
const authController = require('../controllers/userController');
const multer = require('multer');

const router = express.Router();
const upload = multer();

router.get('/user/:username', authController.getUserByUsername);
router.get('/users', authController.getAllUsers);
router.get('/users/:id/payment-info', authController.getPaymentInfoByUser);
router.get('/verify-email/:token', authController.verifyEmail);
router.get('/users/:email', authController.getUserByEmailController);
router.post('/forgot-password', authController.requestReset);
router.post('/logout', authController.logout);
router.post('/users/:userId/payment', authController.PaymentController);
router.post('/users/:userId/onlypayment', authController.PaymentController2);
router.put('/payment/:userId', authController.updatePaymentInfo);
router.put('/users/:userID', authController.updateUserDetails);
router.post('/reset-password', authController.updatePassword);
router.post('/signup', upload.none(), authController.signUp);
router.post('/signin', upload.none(), authController.signIn);
router.delete('/payment-info/:id', authController.deletePaymentInfoById);
router.post('/promotions', authController.createPromotion);
router.delete('/promotions/:id', authController.deletePromotion);
router.put('/promotions/:id', authController.updatePromotion);
router.get('/promotions', authController.getAllPromotions);
router.get('/promotions/:promoCode', authController.getPromotionByPromoCode);
router.post('/billing-address', authController.createBillingAddress);
router.put('/billing-address/:id', authController.updateBillingAddress);
router.delete('/billing-address/:id', authController.deleteBillingAddress);
router.get('/billing-address/user/:userId', authController.getBillingAddressByUserId);
module.exports = router;
