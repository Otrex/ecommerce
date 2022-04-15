const { ACCOUNT_TYPES } = require('../../constants');
const GenericValidator = require('./core');

class LoginValidator extends GenericValidator {
  schema = {
    $$strict: 'remove',
    email: { type: 'email' },
    type: { type: 'enum', values: Object.values(ACCOUNT_TYPES) },
    password: { type: 'string', trim: true, min: 5 },
  };
}

class AddCategoryValidator extends GenericValidator {
  schema = {
    $$strict: 'remove',
    name: { type: 'string', trim: true, min: 1 },
  };
}

class CreateProductValidator extends GenericValidator {
  schema = {
    $$strict: 'remove',
    imageUrl: { type: 'url', trim: true, min: 5 },
    name: { type: 'string', trim: true, min: 5 },
    categoryId: { type: 'string', trim: true, min: 5 },
    price: { type: 'number', min: 1, positive: true },
    weight: { type: 'number', min: 1, positive: true },
    quantity: { type: 'number', min: 1, positive: true },
    expiryDate: { type: 'date', min: 1 },
    minimumOrder: { type: 'number', min: 1, positive: true },
    handlingFee: { type: 'number', min: 1, positive: true },
    description: { type: 'string', trim: true, min: 5 },
  };
}

class SignedURLValidator extends GenericValidator {
  schema = {
    $$strict: 'remove',
    contentType: { type: 'string', trim: true, min: 1 },
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
    type: { type: 'enum', values: Object.values(ACCOUNT_TYPES) },
  };
}

class CustomerRegisterValidator extends GenericValidator {
  schema = {
    $$strict: 'remove',
    email: { type: 'email' },
    password: { type: 'string', trim: true, min: 5 },
    firstName: { type: 'string', trim: true, min: 1 },
    lastName: { type: 'string', trim: true, min: 1 },
    gender: { type: 'string', trim: true, min: 4 },
  };
}

class BusinessRegisterValidator extends GenericValidator {
  schema = {
    $$strict: 'remove',
    sellerDetails: {
      type: 'object',
      props: {
        fullName: { type: 'string', trim: true, min: 5 },
        phoneNumber: { type: 'string', trim: true, min: 5 },
        email: { type: 'string', trim: true, min: 5 },
        password: { type: 'string', trim: true, min: 5 },
      },
    },
    businessDetails: {
      type: 'object',
      props: {
        type: { type: 'string', trim: true, min: 5 },
        name: { type: 'string', trim: true, min: 5 },
        cacNumber: { type: 'string', trim: true, min: 5 },
        state: { type: 'string', trim: true, min: 5 },
        lga: { type: 'string', trim: true, min: 5 },
        address: {
          type: 'object',
          props: {
            lat: { type: 'number', convert: true },
            label: { type: 'string', trim: true, min: 5 },
            long: { type: 'number', convert: true },
          },
        },
      },
    },
    paymentDetails: {
      type: 'object',
      props: {
        accountNumber: { type: 'string', trim: true, min: 5 },
        bank: { type: 'string', trim: true, min: 5 },
        accountName: { type: 'string', trim: true, min: 5 },
        payoutFrequency: { type: 'number', convert: true },
      },
    },
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
    type: { type: 'enum', values: Object.values(ACCOUNT_TYPES) },
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
  CustomerRegisterValidator,
  BusinessRegisterValidator,
  CreateProductValidator,
  AddCategoryValidator,
  SignedURLValidator,
  VerifyEmailValidator,
};
