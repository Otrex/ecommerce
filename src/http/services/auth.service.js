const {
  APP_ENV,
  TOKEN_FLAG,
  ACCOUNT_TYPES,
} = require('../../constants');
const { ServiceError } = require('../lib/exceptions');
const ObjectId = require('mongoose').Types.ObjectId;
const config = require('../../config');
const models = require('../models');
const uuid = require('uuid').v4;
const {
  bcryptHash,
  getTimedToken,
  bcryptCompare,
  generateToken,
  generateTimedToken,
  generateJWTToken,
} = require('../../scripts/utils');
const { DateUpdate } = require('../../core/Utils');
const passport = require('passport');

class AuthService {
  static socialAuthHandler = (_, req, res) => {
    passport.authenticate(
      'google',
      { session: false },
      async (err, user) => {
        if (err || !user) {
          return res.redirect(
            `${config.app.frontendDomain}/${
              config.app.frontendPath
            }?error=${JSON.stringify(err)}`
          );
        }

        const token = await generateJWTToken({
          accountId: account._id,
          flag: TOKEN_FLAG.AUTH,
        });

        return res.redirect(
          `${config.app.frontendDomain}/${config.app.frontendPath}?token=${token}`
        );
      }
    )(req, res);
  };

  static login = async ({ email, password, type }) => {
    const account = await models.Account.findOne(
      { email, type },
      {},
      { select: '+password' }
    );
    if (!account) throw new ServiceError('account does not exist');
    const passwordMatch = await bcryptCompare(
      password,
      account.password
    );
    if (!passwordMatch) throw new ServiceError('password incorrect');
    await models.Account.updateOne(
      { _id: account._id },
      { lastLoggedIn: new Date() }
    );

    let token;
    let tokenType;
    if (account.isEmailVerified) {
      tokenType = TOKEN_FLAG.AUTH;
      token = await generateJWTToken({
        accountId: account._id,
        flag: TOKEN_FLAG.AUTH,
      });
    } else {
      tokenType = TOKEN_FLAG.EMAIL_VERIFY;
      token = await generateJWTToken({
        accountId: account._id,
        flag: TOKEN_FLAG.EMAIL_VERIFY,
      });
    }
    const _account = await models.Account.findById(account._id);
    return {
      data: {
        account: _account.toJSON(),
        type: tokenType,
        token,
      },
    };
  };

  static registerCustomer = async ({
    email,
    password,
    firstName,
    lastName,
    gender,
  }) => {
    const accountExist = await models.Account.findOne({ email });
    if (accountExist) throw new ServiceError('account already exist');

    const account = await models.Account.create({
      password: await bcryptHash(password),
      type: ACCOUNT_TYPES.CUSTOMER,
      firstName,
      lastName,
      email,
    });

    await models.Customer.create({
      accountId: account._id,
      gender,
    });

    const timedToken = await generateTimedToken(
      TOKEN_FLAG.EMAIL_VERIFY,
      account._id,
      5
    );

    // TODO send mail

    return {
      message: 'proceed to verifying your account',
      data: {
        token: await generateJWTToken({
          accountId: account._id,
          flag: TOKEN_FLAG.EMAIL_VERIFY,
        }),
      },
    };
  };

  static registerBusiness = async ({
    sellerDetails,
    businessDetails,
    paymentDetails,
  }) => {
    const { fullName, phoneNumber, email, password } = sellerDetails;

    const accountExist = await models.Account.findOne({ email });
    if (accountExist) throw new ServiceError('account already exist');

    const [firstName, lastName] = fullName.split(' ');

    const account = await models.Account.create({
      password: await bcryptHash(password),
      type: ACCOUNT_TYPES.BUSINESS,
      isEmailVerified: true,
      phoneNumber,
      firstName,
      lastName,
      email,
    });

    const { address } = businessDetails;
    const business = await models.Business.create({
      ...businessDetails,
      accountId: account._id,
      address: await models.Address.create({ ...(address || {}) }),
    });

    await models.BusinessPayment.create({
      businessId: business._id,
      ...paymentDetails,
    });

    const timedToken = await generateTimedToken(
      TOKEN_FLAG.EMAIL_VERIFY,
      account._id,
      5
    );

    // TODO send mail

    return {
      message: 'proceed to verifying your account',
      data: {
        token: await generateJWTToken({
          accountId: account._id,
          flag: TOKEN_FLAG.EMAIL_VERIFY,
        }),
      },
    };
  };

  // TODO
  static verifyEmail = async ({ code, account }) => {
    if (account.isVerified) {
      throw new ServiceError('account has already been verified');
    }

    const timedToken = await getTimedToken(
      TOKEN_FLAG.EMAIL_VERIFY,
      code,
      account._id
    );
    if (!timedToken) {
      throw new ServiceError('invalid or expired code');
    }

    await models.TimedToken.remove({ _id: timedToken._id });

    await models.Account.updateOne(
      { _id: account._id },
      {
        isEmailVerified: true,
        verifiedEmailAt: new Date(),
      }
    );

    const loginToken = await generateJWTToken({
      accountId: account._id,
      flag: TOKEN_FLAG.AUTH,
    });
    return {
      message: 'account has been verified',
      token: loginToken,
    };
  };

  static initiatePasswordReset = async ({ email, type }) => {
    const account = await models.Account.findOne({ email, type });
    if (!account) throw new ServiceError('account does not exist');

    const timedToken = await generateTimedToken(
      TOKEN_FLAG.RESET,
      account._id
    );

    /// Add mails
    if (config.app.env !== APP_ENV.TEST) {
      verification.addTo(account.email).addData({
        account,
        timedToken,
      });

      mailer.send(verification);
    }

    return {
      data: {
        token: await generateJWTToken({
          accountId: account._id,
          flag: TOKEN_FLAG.RESET,
        }),
      },
      message:
        'your reset code has been sent to you mail. please continue to reset your password',
    };
  };

  static resetPassword = async ({
    code,
    confirmPassword,
    password,
    account,
  }) => {
    if (confirmPassword !== password) {
      throw new ServiceError('password does not match');
    }

    const timedToken = await models.TimedToken.findOne({
      accountId: account._id,
      // expiryTimestamp: { $gte: Date.now() },
      type: TOKEN_FLAG.RESET,
      token: code,
    });

    console.log('>>>', code, account, timedToken);

    if (!timedToken) {
      throw new ServiceError('invalid or expired token');
    }

    await models.TimedToken.remove({ _id: timedToken._id });

    await models.Account.updateOne(
      { _id: account._id },
      {
        lastPasswordReset: new Date(),
        password: await bcryptHash(password),
      }
    );

    return {
      message: 'password reset successful!!',
    };
  };

  static resendEmailToken = async ({ accountId }) => {
    const account = await models.Account.findById(accountId);
    if (!account) throw new ServiceError('account does not exist');
    if (account.isEmailVerified) {
      throw new ServiceError('account has already been verified');
    }

    // TODO throttle resend emails

    await models.TimedToken.remove({
      accountId: account.id,
      type: 'register',
    });

    const timedToken = await generateTimedToken(
      'register',
      account.id,
      5
    );

    if (config.app.env !== APP_ENV.TEST) {
      verification.addTo(account.email).addData({
        account,
        timedToken,
      });

      mailer.send(verification);
    }

    return {
      message: 'proceed to verifying your account',
    };
  };
}

module.exports = AuthService;
