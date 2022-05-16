const express = require('express');
const AuthController = require('../controllers/auth');
const { authentication, addType } = require('../../middlewares/auth');

const { TOKEN_FLAG, ACCOUNT_TYPES } = require('../../constants');

const router = express.Router();

router.post('/login', AuthController.login);

router.post('/buyer/login', addType(ACCOUNT_TYPES.CUSTOMER), AuthController.login);
router.post('/vendor/login',addType(ACCOUNT_TYPES.BUSINESS),  AuthController.login);
router.post('/admin/login', addType(ACCOUNT_TYPES.ADMIN), AuthController.login);

router.post('/buyer/register', AuthController.registerCustomer);
router.post('/vendor/register', AuthController.registerBusiness);

router.post(
  '/verify-email',
  authentication(TOKEN_FLAG.EMAIL_VERIFY),
  AuthController.verifyEmail
);
router.post(
  '/reset-password',
  authentication(TOKEN_FLAG.RESET),
  AuthController.passwordReset
);
router.post('/forgot-password', AuthController.initPasswordReset);

module.exports = router;
