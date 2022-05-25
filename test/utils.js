const ObjectId = require('mongoose').Types.ObjectId;
const { bcryptHash } = require('../src/scripts/utils')
const models = require('../src/http/models');
const { generateJWTToken } = require('../src/scripts/utils');
const { TOKEN_FLAG, ACCOUNT_TYPES } = require('../src/constants');
const faker = require('faker');

exports.getToken = async (
  { accountId },
  type = TOKEN_FLAG.EMAIL_VERIFY
) => {
  return models.TimedToken.findOne({
    accountId: ObjectId(accountId),
    type,
  });
};

exports.createAccountReturnToken = async (data = {}) => {
  const account = await models.Account.create({
    ...data,
    password: await bcryptHash(data.password),
    isEmailVerified: true,
    emailVerifiedAt: new Date(),
  });

  const address = await models.Address.create({
    lat: faker.address.latitude(),
    lng: faker.address.longitude(),
    label: faker.address.streetAddress()
  })

  if (data.type === ACCOUNT_TYPES.BUSINESS) {
    await models.Business.create({
      accountId: account._id,
      address: address._id,
    });
  }

  if (data.type === ACCOUNT_TYPES.CUSTOMER) {
    await models.Customer.create({
      accountId: account._id,
      address: address._id,
    });
  }

  const token = await generateJWTToken({
    accountId: account._id,
    flag: TOKEN_FLAG.AUTH,
  });

  return { token, account };
};
