const GenericValidator = require('./core');

class LoginValidator extends GenericValidator {
  schema = {
    $$strict: 'remove',
    email: { type: 'email' },
    type: { type: 'enum', values: ['client', 'rider'] },
    password: { type: 'string', trim: true, min: 5 },
  };
}

class RegisterValidator extends GenericValidator {
  schema = {
    $$strict: 'remove',
    email: { type: 'email' },
    password: { type: 'string', trim: true, min: 5 },
    firstName: { type: 'string', trim: true, min: 1 },
    lastName: { type: 'string', trim: true, min: 1 },
    phoneNumber: { type: 'string', trim: true, min: 6 },
    type: { type: 'enum', values: ['client', 'rider'] },
  };
}

class VerifyEmailValidator extends GenericValidator {
  schema = {
    $$strict: 'remove',
    accountId: { type: 'string' },
    token: { type: 'string', trim: true, min: 4, max: 5 },
  };
}

class ResendVerificationEmailValidator extends GenericValidator {
  schema = {
    $$strict: 'remove',
    accountId: { type: 'string' },
  };
}

class InitPasswordResetValidator extends GenericValidator {
  schema = {
    $$strict: 'remove',
    email: { type: 'email' },
    type: { type: 'enum', values: ['client', 'rider'] },
  };
}

class PasswordResetValidator extends GenericValidator {
  schema = {
    $$strict: 'remove',
    password: { type: 'string', trim: true, min: 5 },
    confirmPassword: { type: 'string', trim: true, min: 5 },
    token: { type: 'string', trim: true, min: 10 },
  };
}

class CreateDropOffValidator extends GenericValidator {
  schema = {
    $$strict: 'remove',
    items: {
      type: 'array',
      props: {
        quantity: { type: 'number', min: 1 },
        weightId: { type: 'any' },
        categoryId: { type: 'any' },
      },
    },
  };
}

module.exports = {
  LoginValidator,
  RegisterValidator,
  CreateDropOffValidator,
  PasswordResetValidator,
  InitPasswordResetValidator,
  ResendVerificationEmailValidator,
  VerifyEmailValidator,
};
