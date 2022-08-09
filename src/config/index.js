const { APP_ENV } = require('../constants');
const { name } = require('../../package.json');

module.exports = {
  app: {
    port: process.env.PORT || 3032,
    secret: process.env.APP_SECRET,
    name: process.env.APP_NAME || name,
    env: process.env.APP_ENV,
    frontendDomain: process.env.APP_FRONTEND_DOMAIN,
    frontendPath: process.env.APP_FRONTEND_PATH,
    bcryptRounds: 10,
    email: process.env.APP_EMAIL,
  },
  db: {
    name:
      process.env.APP_ENV !== APP_ENV.TEST
        ? process.env.DB_DATABASE
        : process.env.TEST_DB_DATABASE,

    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    uri: process.env.DB_URI,
    authSource:
      'admin&readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false',
  },
  session: {
    ttl: +(process.env.SESSION_TTL || 1 * 24 * 60 * 60),
  },
  email: {
    verificationTTL: process.env.EMAIL_VERIFICATION_TTL || '24h',
    from: process.env.APP_EMAIL,
    sgKey: process.env.SENDGRID_KEY,
    sendChampKey: process.env.SENDCHAMP_KEY,
  },
  admin: {
    email: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_PASSWORD,
  },
  s3: {
    endpoint: process.env.S3_ENDPOINT,
    accessKey: process.env.S3_ACCESS_KEY,
    secretKey: process.env.S3_SECRET_KEY,
    bucket: process.env.S3_BUCKET,
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  paystack: {
    key: process.env.PAYSTACK_KEY,
  },
};
