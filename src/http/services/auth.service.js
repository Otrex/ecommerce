const config = require('../../config');
const { APP_ENV, TOKEN_FLAG } = require('../../constants');
const uuid = require('uuid').v4;
const { ServiceError } = require('../lib/exceptions');
const ObjectId = require('mongoose').Types.ObjectId;
const { mailer, mails } = require('../mails');
const models = require('../models');
const {
  bcryptHash,
  getTimedToken,
  bcryptCompare,
  generateToken,
  generateTimedToken,
  generateJWTToken,
} = require('../../scripts/utils');
const { DateUpdate } = require('../../core/Utils');

const { verification } = mails;
class AuthService {
  static login = async ({ email, password, type }, req) => {
    const account = await models.Account.findOne(
      { email, type },
      {},
      { select: '+password' }
    );
    if (!account) throw new ServiceError('account does not exist');
    const passwordMatch = await bcryptCompare(password, account.password);
    if (!passwordMatch) throw new ServiceError('password incorrect');
    await models.Account.updateOne(
      { _id: account._id },
      { lastLoggedIn: new Date() }
    );

    let token;
    if (account.isEmailVerified) {
      token = await generateJWTToken({
        accountId: account._id,
        flag: TOKEN_FLAG.AUTH,
      });
    } else {
      token = await generateJWTToken({
        accountId: account._id,
        flag: TOKEN_FLAG.EMAIL_VERIFY,
      });
    }
    return { account: await models.Account.findById(account._id), token };
  };

  static register = async ({
    email,
    password,
    firstName,
    lastName,
    phoneNumber,
    type,
  }) => {
    const accountExist = await models.Account.findOne({ email });
    if (accountExist) throw new ServiceError('account already exist');

    const accountData = {
      type,
      email,
      firstName,
      lastName,
      phoneNumber,
      password: await bcryptHash(password),
    };
    const account = await models.Account.create(accountData);

    const timedToken = await generateTimedToken('register', account._id, 5);

    if (type === 'client' && config.app.env !== APP_ENV.TEST) {
      verification.addTo(account.email).addData({
        account,
        timedToken,
      });

      mailer.send(verification);
    }

    return {
      data: await models.Account.findById(account._id),
      message: 'proceed to verifying your account',
    };
  };

  static verifyEmail = async ({ token, accountId }) => {
    const account = await models.Account.findById(accountId);
    if (!account) throw new ServiceError('account does not exist');
    if (account.isVerified) {
      throw new ServiceError('account has already been verified');
    }
    const timedToken = await getTimedToken('register', token, account._id);

    if (!timedToken) {
      throw new ServiceError('invalid or expired token');
    }

    await models.Account.updateOne(
      { _id: account._id },
      {
        isEmailVerified: true,
        verifiedEmailAt: new Date(),
      }
    );

    await models.TimedToken.remove({ _id: timedToken._id });
    const token = await generateJWTToken({
      accountId: account._id,
      flag: TOKEN_FLAG.AUTH,
    });
    return {
      message: 'account has been verified',
      token,
    };
  };

  static initiatePasswordReset = async ({ email, type }) => {
    const account = await models.Account.findOne({ email, type });
    if (!account) throw new ServiceError('account does not exist');

    const timedToken = await models.TimedToken.create({
      expiryTimestamp: new DateUpdate().addHoursToNow(1),
      token: `${generateToken(14)}${uuid()}`,
      accountId: account._id,
      type: 'reset-password',
    });

    return {
      token: timedToken.token,
      message: 'please continue to reset your password',
    };
  };

  static resetPassword = async ({ token, confirmPassword, password }) => {
    if (confirmPassword !== password) {
      throw new ServiceError('password does not match');
    }

    const timedToken = await models.TimedToken.findOne({
      expiryTimestamp: { $gte: Date.now() },
      type: 'reset-password',
      token,
    });

    if (!timedToken) {
      throw new ServiceError('invalid or expired token');
    }

    await models.Account.updateOne(
      { _id: timedToken.accountId },
      {
        lastPasswordReset: new Date(),
        password: await bcryptHash(password),
      }
    );

    await models.TimedToken.remove({ _id: timedToken._id });

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

    const timedToken = await generateTimedToken('register', account.id, 5);

    verification.addTo(account.email).addData({
      account,
      timedToken,
    });

    mailer.send(verification);

    return {
      message: 'proceed to verifying your account',
    };
  };
}

module.exports = AuthService;
