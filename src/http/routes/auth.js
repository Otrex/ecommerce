const express = require('express');
const AuthController = require('../controllers/auth');

const router = express.Router();

router.post('/login', AuthController.login);
router.post('/register', AuthController.register);

router.post('/verify-email', AuthController.verifyEmail);
router.post('/reset-password', AuthController.passwordReset);
router.post('/forgot-password', AuthController.initPasswordReset);

module.exports = router;
