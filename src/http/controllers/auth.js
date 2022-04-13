const requestHandler = require('.');
const AuthService = require('../services/auth.service');
const {
  LoginValidator,
  RegisterValidator,
  VerifyEmailValidator,
  PasswordResetValidator,
  CustomerRegisterValidator,
  InitPasswordResetValidator,
  BusinessRegisterValidator,
  ResendVerificationEmailValidator,
} = require('../validators');

class AuthController {
  static login = requestHandler({
    validator: LoginValidator,
    handler: AuthService.login,
  });

  static registerCustomer = requestHandler({
    validator: CustomerRegisterValidator,
    handler: AuthService.registerCustomer,
  });

  static registerBusiness = requestHandler({
    validator: BusinessRegisterValidator,
    handler: AuthService.registerBusiness,
  });

  static verifyEmail = requestHandler({
    validator: VerifyEmailValidator,
    handler: AuthService.verifyEmail,
  });

  static initPasswordReset = requestHandler({
    handler: AuthService.initiatePasswordReset,
    validator: InitPasswordResetValidator,
  });

  static passwordReset = requestHandler({
    handler: AuthService.resetPassword,
    validator: PasswordResetValidator,
  });

  static resendVerificationEmail = requestHandler({
    handler: AuthService.resendEmailToken,
    validator: ResendVerificationEmailValidator,
  });
}

module.exports = AuthController;
