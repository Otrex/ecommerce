const { ACCOUNT_TYPES } = require('../../constants');
const GenericValidator = require('./core');

const paginationSchemaFragment = {
  page: {
    type: 'number',
    convert: true,
    min: 1,
    optional: true,
    default: 1,
  },
  limit: {
    type: 'number',
    convert: true,
    min: 1,
    optional: true,
    default: 20,
  },
};

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
    description: {
      type: 'string',
      trim: true,
      min: 1,
      optional: true,
    },
  };
}

class AddLogisticsValidator extends GenericValidator {
  schema = {
    $$strict: 'remove',
    name: { type: 'string', trim: true, min: 1 },
    description: { type: 'string' },
    costPerUnit: { type: 'number', positive: true },
    isDefault: { type: 'boolean', optional: true, default: false },
  };
}

class SetDefaultLogisticsValidator extends GenericValidator {
  schema = {
    $$strict: 'remove',
    companyId: { type: 'objectID' },
  };
}

class ApproveProductValidator extends GenericValidator {
  schema = {
    $$strict: 'remove',
    productId: { type: 'string', trim: true, min: 5 },
  };
}

class LikeProductValidator extends ApproveProductValidator {}
class GetProductDetailsValidator extends ApproveProductValidator {}

class CreateProductValidator extends GenericValidator {
  schema = {
    $$strict: 'remove',
    imageUrl: { type: 'url', trim: true, min: 5 },
    name: { type: 'string', trim: true, min: 5 },
    categoryId: { type: 'string', trim: true, min: 5 },
    price: { type: 'number', positive: true },
    weight: { type: 'number', positive: true },
    quantity: { type: 'number', positive: true },
    expiryDate: { type: 'date', convert: true },
    minimumOrder: { type: 'number', min: 0 },
    handlingFee: { type: 'number', min: 0 },
    description: { type: 'string', trim: true, min: 5 },
  };
}

class AddFeedbackValidator extends GenericValidator {
  schema = {
    $$strict: 'remove',
    rating: { type: 'number', trim: true, min: 0, max: 5 },
    comment: { type: 'string', trim: true, optional: true },
    productId: { type: 'string', trim: true, min: 5 },
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

class GetBusinessProductValidator extends GenericValidator {
  schema = {
    $$strict: 'remove',
    ...paginationSchemaFragment,
    status: { type: 'string', min: 0, trim: true, default: '' },
  };
}

class GetProductByCategoryValidator extends GenericValidator {
  schema = {
    $$strict: 'remove',
    ...paginationSchemaFragment,
    categoryId: { type: 'string', min: 0, trim: true },
  };
}

class GetFavoriteProductValidator extends GenericValidator {
  schema = {
    $$strict: 'remove',
    ...paginationSchemaFragment,
  };
}

class GetProductValidator extends GenericValidator {
  schema = {
    $$strict: 'remove',
    ...paginationSchemaFragment,
  };
}

class SearchProductValidator extends GenericValidator {
  schema = {
    $$strict: 'remove',
    ...paginationSchemaFragment,
    query: { type: 'string', default: '' },
  };
}

class GetCategoriesStats extends GetProductValidator {}

class GetBusinessesPaginationValidator extends GenericValidator {
  schema = {
    $$strict: 'remove',
    query: { type: 'string', min: 0, trim: true },
    ...paginationSchemaFragment,
  };
}

class GetAccountPaginationValidator extends GenericValidator {
  schema = {
    $$strict: 'remove',
    ...paginationSchemaFragment,
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
        state: { type: 'string', trim: true },
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
    code: { type: 'string', trim: true, min: 4, max: 5 },
  };
}

class ResendVerificationEmailValidator extends GenericValidator {
  schema = {
    $$strict: 'remove',
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
    code: { type: 'string', trim: true, min: 4 },
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

class AddToCartValidator extends GenericValidator {
  schema = {
    $$strict: 'remove',
    productId: 'objectID',
    quantity: {
      type: 'number',
      positive: true,
      integer: true,
    },
  };
}

class DeleteFromCartValidator extends GenericValidator {
  schema = {
    $$strict: 'remove',
    productId: 'objectID',
  };
}

class GetAccountValidator extends GenericValidator {
  schema = {
    $$strict: 'remove',
    accountId: { type: 'string', min: 0, trim: true },
  };
}

// class AddLogisticsValidator extends GenericValidator {
//   schema = {
//     $$strict: 'remove',
//     name: { type: 'string', trim: true, min: 1 },
//     description: { type: 'string' },
//     costPerUnit: { type: 'number', positive: true },
//     isDefault: { type: 'boolean', optional: true, default: false },
//   };
// }

// class SetDefaultLogisticsValidator extends GenericValidator {
//   schema = {
//     $$strict: 'remove',
//     companyId: { type: 'objectID' },
//   };
// }
module.exports = {
  LoginValidator,
  AddLogisticsValidator,
  SetDefaultLogisticsValidator,
  RegisterValidator,
  AddToCartValidator,
  GetAccountValidator,
  LikeProductValidator,
  GetProductValidator,
  AddLogisticsValidator,
  CreateDropOffValidator,
  PasswordResetValidator,
  GetCategoriesStats,
  DeleteFromCartValidator,
  SetDefaultLogisticsValidator,
  InitPasswordResetValidator,
  GetProductDetailsValidator,
  GetFavoriteProductValidator,
  GetProductByCategoryValidator,
  GetBusinessesPaginationValidator,
  GetAccountPaginationValidator,
  ResendVerificationEmailValidator,
  GetBusinessProductValidator,
  CustomerRegisterValidator,
  BusinessRegisterValidator,
  SearchProductValidator,
  ApproveProductValidator,
  CreateProductValidator,
  AddFeedbackValidator,
  AddCategoryValidator,
  SignedURLValidator,
  VerifyEmailValidator,
};
