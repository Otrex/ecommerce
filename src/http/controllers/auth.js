const requestHandler = require('.');
const AuthService = require('../services/auth.service');
const {
  LoginValidator,
  RegisterValidator,
  VerifyEmailValidator,
  PasswordResetValidator,
  InitPasswordResetValidator,
  ResendVerificationEmailValidator
} = require('../validators');

class AuthController {
  static login = requestHandler({
    validator: LoginValidator,
    handler: AuthService.login,
  });

  static register = requestHandler({
    validator: RegisterValidator,
    handler: AuthService.register,
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
