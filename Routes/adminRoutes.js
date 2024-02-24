// adminRoutes.js

const express = require('express');
const adminController = require('../controllers/adminController');

const router = express.Router();

router.get('/admin/users', adminController.getAllUsers);
router.post('/admin/signin', adminController.adminSignIn);
router.post('/admin/addAdmin',adminController.createAdmin);

module.exports = router;
