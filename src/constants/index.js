module.exports = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  ACCOUNT_TYPES: {
    CUSTOMER: 'customer',
    BUSINESS: 'business',
    ADMIN: 'admin',
  },
  PRODUCT_STATUS: {
    APPROVED: 'approved',
    PENDING: 'pending',
    DISSAPPROVED: 'disapproved',
  },
  ORDER_STATUS: {
    SHIPPED: 'shipped',
    PENDING: 'pending',
    COMPLETED: 'completed',
    INCOMPLETED: 'incompleted',
    CANCELLED: 'cancelled',
  },
  TRANSACTION_STATUS: {
    SUCCESS: 'success',
    PENDING: 'pending',
    COMPLETED: 'completed',
  },
  TOKEN_FLAG: {
    AUTH: 'auth',
    EMAIL_VERIFY: 'email_verification',
    RESET: 'password_reset',
  },
  MESSAGE: {
    ERROR: {
      LOGIN: 'email or password incorrect',
      VALIDATION: {
        NO_SCHEMA: 'no schema available for validation',
      },
      ALREADY_EXISTS: 'user with this email already exists',
    },
  },
  APP_ENV: {
    TEST: 'test',
    LOCAL: 'local',
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
  },
};
