const express = require('express');
const AuthController = require('../controllers/auth');

const router = express.Router();

router.post('/auth/login', AuthController.login);
router.post('/auth/buyer/register', AuthController.registerCustomer);
router.post('/auth/vendor/register', AuthController.registerBusiness);

router.post('/auth/verify-email', AuthController.verifyEmail);
router.post('/auth/reset-password', AuthController.passwordReset);
router.post('/auth/forgot-password', AuthController.initPasswordReset);

module.exports = router;
