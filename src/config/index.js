const { APP_ENV } = require('../constants');
const { name } = require('../../package.json');

module.exports = {
  app: {
    port: process.env.PORT || 3032,
    secret: process.env.APP_SECRET,
    name: process.env.APP_NAME || name,
    env: process.env.APP_ENV,
    bcryptRounds: 10,
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
  },
};
