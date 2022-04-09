module.exports = {
  DEVELOPMENT: 'development',
  PRODUCTION: 'production',
  ACCOUNT_TYPES: {
    CUSTOMER: 'customer',
    VENDOR: 'vendor',
    ADMIN: 'admin',
  },
  TOKEN_FLAG: {
    AUTH: 'auth',
    EMAIL_VERIFY: 'email_verification'
  },
  MESSAGE: {
    ERROR: {
      LOGIN: 'email or password incorrect',
      VALIDATION: {
        NO_SCHEMA: 'no schema available for validation',
      },
      ALREADY_EXISTS: 'user with this email already exists',
    },
    SUCCESS: {
      registration: '',
    },
  },
  APP_ENV: {
    TEST: 'test',
    LOCAL: 'local',
    DEVELOPMENT: 'development',
    PRODUCTION: 'production',
  },
};
