const { ServiceError, NotFoundError } = require('../lib/exceptions');
const { calcSkip, paginateResponse } = require('../../scripts/utils');
const ObjectId = require('mongoose').Types.ObjectId;
const config = require('../../config');
const models = require('../models');
const { omit } = require('lodash');
const { ACCOUNT_TYPES } = require('../../constants');

class UserService {
  static getMe = async ({ account }) => {
    return {
      data: {
        ...(await models.Account.findById(account._id)).toJSON(),
        password: undefined,
      }
    }
  }

  static getProfile = async ({ account }) => {
    let profile;
    if (account.type === ACCOUNT_TYPES.CUSTOMER) {
      profile = await models.Customer
        .findOne({ accountId: account._id })
        .populate({
          path: 'accountId',
          select: ['-password']
        })
        .populate('address')
        .exec()

      if (!profile) throw new ServiceError('profile not found')

      profile = {
        ...profile.toJSON(),
        accountId: undefined,
        account: profile.accountId,
      }
    }

    if (account.type === ACCOUNT_TYPES.BUSINESS) {
      profile = await models.Business
        .findOne({ accountId: account._id })
        .populate({
          path: 'accountId',
          select: ['-password']
        })
        .populate('address')
        .populate('logisticsId')
        .exec();

      if (!profile) throw new ServiceError('profile not found')

      profile = {
        ...profile.toJSON(),
        accountId: undefined,
        logisticsId: undefined,
        account: profile.accountId,
        logistics: profile.logisticsId
      }
    }

    return {
      data: profile,
    }
  }

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

  static updateCustomerDetails = async ({
    firstName,
    lastName,
    gender,
    account,
  }) => {
    const accountExist = await models.Account.findOne({
      _id: account._id,
    });
    if (!accountExist)
      throw new ServiceError('account already exist');

    const accountId = accountExist._id;

    if (firstName) {
      await models.Account.findByIdAndUpdate(
        accountId,
        {
          firstName,
        }
      );
    }

    if (lastName) {
      await models.Account.findByIdAndUpdate(
        accountId,
        {
          lastName,
        }
      );
    }

    if (gender) {
      await models.Customer.findOneAndUpdate(
        { accountId: account._id },
        {
          gender,
        }
      );
    }

    return {
      message: 'account update successful',
    };
  };

  static updateBusinessDetails = async ({
    sellerDetails,
    businessDetails,
    paymentDetails,
    account,
  }) => {
    const { fullName, phoneNumber, email } = sellerDetails;

    const accountExist = await models.Account.findOne({ _id: account._id });
    if (!accountExist)
      throw new ServiceError('account already exist');

    const accountId = accountExist._id;
    const [firstName, lastName] = fullName.split(' ');

    if (sellerDetails) {
      await models.Account.findByIdAndUpdate(
        account._id,
        {
          ...sellerDetails,
          firstName,
          lastName,
        }
      );
    }

    const business = await models.Business.findOne({ accountId });
    if (!business) throw new ServiceError('business does not exists');

    if (businessDetails) {
      await models.Business.findOneAndUpdate(
        { accountId },
        {
          ...businessDetails,
        }
      );

      if (businessDetails.address) {
        await models.Address.findByIdAndUpdate(
          business.address,
          businessDetails.address
        );
      }
    }

    if (paymentDetails) {
      await models.BusinessPayment.findOneAndUpdate(
        { businessId: business._id },
        {
          ...paymentDetails,
        }
      );
    }

    return {
      message: 'account update successful',
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

  static getCustomersData = async ({ page, limit }) => {
    const skip = calcSkip({ page, limit });
    const [result] = await models.Account.aggregate([
      {
        $match: {
          type: ACCOUNT_TYPES.CUSTOMER,
        },
      },
      {
        $lookup: {
          from: models.Order.collection.collectionName,
          localField: '_id',
          foreignField: 'accountId',
          as: 'order',
          pipeline: [
            {
              $group: {
                _id: '$status',
                total: {
                  $sum: 1,
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          totalOrders: {
            $sum: '$order.total',
          },
        },
      },
      {
        $project: {
          password: 0,
        },
      },
      {
        $facet: {
          data: [{ $skip: skip }, { $limit: limit }],
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

    const data = result ? [result.data, result.count] : [[], 0];

    return paginateResponse(data, page, limit);
  };

  static getBusinesses = async ({ page, limit }) => {
    const skip = calcSkip({ page, limit });
    const [result] = await models.Business.aggregate([
      {
        $lookup: {
          from: models.Account.collection.collectionName,
          localField: 'accountId',
          foreignField: '_id',
          as: '_account',
          pipeline: [
            {
              $project: {
                firstName: 1,
                lastName: 1,
              },
            },
          ],
        },
      },
      {
        $lookup: {
          from: models.Product.collection.collectionName,
          localField: '_id',
          foreignField: 'creatorId',
          as: 'products',
          pipeline: [
            {
              $lookup: {
                from: models.Category.collection.collectionName,
                localField: 'categoryId',
                foreignField: '_id',
                as: 'category',
              },
            },
            { $unwind: '$category' },
            {
              $project: {
                quantity: 1,
                price: 1,
                category: 1,
                feedback: 1,
                totalComments: {
                  $size: '$feedback',
                },
                totalProductCost: {
                  $multiply: ['$price', '$quantity'],
                },
                // Sync amount-left with completed orders
                totalSoldProductCost: {
                  $multiply: [
                    { $subtract: ['$quantity', '$quantityLeft'] },
                    '$price',
                  ],
                },
              },
            },
          ],
        },
      },
      {
        $addFields: {
          feedback: '$products.feedback',
        },
      },
      {
        $addFields: {
          totalFeedbacks: {
            $reduce: {
              input: '$feedback',
              initialValue: [],
              in: { $concatArrays: ['$$value', '$$this'] },
            },
          },
        },
      },
      {
        $addFields: {
          totalComments: { $sum: '$products.totalComments' },
        },
      },
      {
        $addFields: {
          categories: '$products.category.name',
        },
      },
      {
        $addFields: {
          totalCategories: {
            $size: { $setUnion: ['$categories', '$categories'] },
          },
        },
      },
      {
        $addFields: {
          avgRating: {
            $cond: [
              { $eq: ['$totalComments', 0] },
              0,
              {
                $divide: [
                  { $sum: '$totalFeedbacks.rating' },
                  '$totalComments',
                ],
              },
            ],
          },
        },
      },
      {
        $addFields: {
          totalProducts: {
            $size: '$products',
          },
        },
      },
      {
        $addFields: {
          totalProductCost: {
            $sum: '$products.totalProductCost',
          },
        },
      },
      {
        $addFields: {
          totalSoldProductCost: {
            $sum: '$products.totalSoldProductCost',
          },
        },
      },
      { $addFields: { account: { $first: '$_account' } } },
      {
        $project: {
          totalSoldProductCost: 1,
          totalProductCost: 1,
          totalFeedbacks: 1,
          totalProducts: 1,
          totalComments: 1,
          account: 1,
          avgRating: 1,
          totalCategories: 1,
          // feedback: 1,
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
          _account: 0,
          accountId: 0,
        },
      },
    ]);

    const data = result ? [result.businesses, result.count] : [[], 0];

    return paginateResponse(data, page, limit);
  };

  // NOT added to route
  static setAddress = async ({
    account,
    lat,
    lng,
    fullAddress,
    country,
    state,
    street,
  }) => {
    let user;
    if (account.type === ACCOUNT_TYPES.BUSINESS) {
      user = await models.Business.findOne({
        accountId: account._id,
      });
    }

    if (account.type === ACCOUNT_TYPES.CUSTOMER) {
      user = await models.Customer.findOne({
        accountId: account._id,
      });
    }

    if (!user) throw new NotFoundError('account not found');

    let { address: addressId } = user;

    if (!addressId && account.type === ACCOUNT_TYPES.CUSTOMER) {
      addressId = await models.Address.create({});
      await models.Customer.findByIdAndUpdate(user._id, {
        address: addressId,
      });
    }

    const $address = await models.Address.findByIdAndUpdate(
      addressId,
      {
        lat,
        lng,
        fullAddress,
        country,
        street,
        state,
      },
      { new: true }
    );

    return {
      data: $address,
      message: 'successful',
    };
  };
}

module.exports = UserService;
