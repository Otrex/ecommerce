const { ServiceError, NotFoundError } = require('../lib/exceptions');
const { calcSkip, paginateResponse } = require('../../scripts/utils');
const ObjectId = require('mongoose').Types.ObjectId;
const config = require('../../config');
const models = require('../models');


class UserService {
  static suspendUser = async ({ accountId }) => {
    const account = await models.Account.findById(accountId);
    if (!account) throw new NotFoundError('account not found');

    await models.Account.findByIdAndUpdate(account._id, {
      suspend: true
    });

    return {
      message: 'account has been suspended'
    }
  };

  static unsuspendUser = async ({ accountId }) => {
    const account = await models.Account.findById(accountId);
    if (!account) throw new NotFoundError('account not found');

    await models.Account.findByIdAndUpdate(account._id, {
      suspend: false
    });

    return {
      message: 'account has been unsuspended'
    }
  };

  static searchForBusiness = async ({ query, page, limit }) => {
    const skip = calcSkip({ page, limit });
    console.log({ query, page, limit, skip })
    const [result] = await models.Business.aggregate([
      {
        $lookup: {
          from: models.Product.collection.collectionName,
          localField: 'accountId',
          foreignField: '_id',
          as: 'account',
        }
      },
      {
        $match: {
          name: { $regex: new RegExp(`${query}`, 'gi') }
        }
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
        },
      },
    ]);

    const data = result 
      ? [result.businesses, result.count] 
      : [[], 0];
      
    return paginateResponse(data, page, limit);
  }
}

module.exports = UserService;