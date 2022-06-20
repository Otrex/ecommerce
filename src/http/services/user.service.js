const { ServiceError, NotFoundError } = require('../lib/exceptions');
const { calcSkip, paginateResponse } = require('../../scripts/utils');
const ObjectId = require('mongoose').Types.ObjectId;
const config = require('../../config');
const models = require('../models');
const { omit } = require('lodash');

class UserService {
  static suspendUser = async ({ accountId }) => {
    const account = await models.Account.findById(accountId);
    if (!account) throw new NotFoundError('account not found');

    await models.Account.findByIdAndUpdate(account._id, {
      suspend: true,
    });

    return {
      message: 'account has been suspended',
    };
  };

  static unsuspendUser = async ({ accountId }) => {
    const account = await models.Account.findById(accountId);
    if (!account) throw new NotFoundError('account not found');

    await models.Account.findByIdAndUpdate(account._id, {
      suspend: false,
    });

    return {
      message: 'account has been unsuspended',
    };
  };

  static searchForBusiness = async ({ query, page, limit }) => {
    const skip = calcSkip({ page, limit });
    const [result] = await models.Business.aggregate([
      {
        $lookup: {
          from: models.Account.collection.collectionName,
          localField: 'accountId',
          foreignField: '_id',
          as: 'faccount',
        },
      },
      {
        $match: {
          name: { $regex: new RegExp(`${query}`, 'gi') },
        },
      },
      { $addFields: { account: { $first: '$faccount' } } },
      {
        $project: {
          faccount: 0,
          accountId: 0,
        },
      },
      {
        $facet: {
          businesses: [{ $skip: skip }, { $limit: limit }],
          totalCount: [
            {
              $count: 'count',
            },
          ],
        },
      },
      { $unwind: '$totalCount' },
      {
        $addFields: {
          count: '$totalCount.count',
        },
      },
      {
        $project: {
          totalCount: 0,
          faccount: 0,
          accountId: 0,
        },
      },
    ]);

    const data = result
      ? [
          result.businesses.map((e) => ({
            ...e,
            account: omit(e.account, ['password']),
          })),
          result.count,
        ]
      : [[], 0];

    return paginateResponse(data, page, limit);
  };
}

module.exports = UserService;
