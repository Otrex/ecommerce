const ObjectId = require('mongoose').Types.ObjectId;
const models = require('../src/http/models');
const { generateJWTToken } = require('../src/scripts/utils');
const { TOKEN_FLAG, ACCOUNT_TYPES } = require('../src/constants')

exports.getToken = async ({ accountId }, type = TOKEN_FLAG.EMAIL_VERIFY) => {
  return models.TimedToken.findOne({
    accountId: ObjectId(accountId),
    type,
  });
};

exports.createAccountReturnToken = async (data = {}) => {
  const account = await models.Account.create({
    ...data,
    isEmailVerified: true,
    emailVerifiedAt: new Date(),
  });

  if (data.type === ACCOUNT_TYPES.BUSINESS) {
    await models.Business.create({
      accountId: account._id
    })
  }

  if (data.type === ACCOUNT_TYPES.CUSTOMER) {
    await models.Customer.create({
      accountId: account._id
    })
  }

  const token = await generateJWTToken({
    accountId: account._id,
    flag: TOKEN_FLAG.AUTH,
  });

  return { token, account }
}
