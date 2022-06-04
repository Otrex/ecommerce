const { NotFoundError, ServiceError } = require('../lib/exceptions');
const { calcSkip, paginateResponse } = require('../../scripts/utils');
const models = require('../models');
const { ORDER_STATUS } = require('../../constants');

class OrderService {
  static stats = async ({ account }) => {
    const vendor = await models.Business.findOne({
      accountId: account._id,
    });
    if (!vendor) throw new NotFoundError('vendor not found');
    const result = await models.Order.aggregate([
      {
        $lookup: {
          from: models.Product.collection.collectionName,
          localField: 'productId',
          foreignField: '_id',
          as: 'product',
          pipeline: [
            {
              $match: {
                creatorId: vendor._id,
              },
            },
          ],
        },
      },
      {
        $group: {
          _id: '$status',
          totalQuantity: { $sum: '$quantity' },
          count: { $sum: 1 },
        },
      },
    ]);

    let productsSold = 0;
    let cancelledOrders = 0;
    let pendingOrders = 0;
    let incompleteOrders = 0;

    if (result) {
      productsSold =
        result.find((e) => e._id === ORDER_STATUS.SHIPPED)
          ?.totalQuantity || 0;
      incompleteOrders =
        result.find((e) => e._id === ORDER_STATUS.INCOMPLETED)
          ?.count || 0;
      cancelledOrders =
        result.find((e) => e._id === ORDER_STATUS.CANCELLED)?.count ||
        0;
      pendingOrders =
        result.find((e) => e._id === ORDER_STATUS.PENDING)?.count ||
        0;
    }

    return {
      data: {
        productsSold,
        cancelledOrders,
        incompleteOrders,
        pendingOrders,
      },
    };
  };

  static activeOrders = async ({ account, page, limit }) => {
    const activeOrderStatus = [
      ORDER_STATUS.SHIPPED,
      ORDER_STATUS.PENDING
    ]
    const skip = calcSkip({ page, limit });
    const vendor = await models.Business.findOne({
      accountId: account._id,
    });
    if (!vendor) throw new NotFoundError('vendor not found');
    const [result] = await models.Order.aggregate([
      {
        $lookup: {
          from: models.Product.collection.collectionName,
          localField: 'productId',
          foreignField: '_id',
          as: 'product',
          pipeline: [
            {
              $match: {
                creatorId: vendor._id,
              },
            },
          ],
        },
      },
      {
        $match: {
          status: {
            $in: activeOrderStatus,
          },
        }
      },
      {
        $facet: {
          orders: [{ $skip: skip }, { $limit: take }],
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
      ? [result.orders, result.count] 
      : [[], 0];

    return paginateResponse(data, page, limit)
  }
}

module.exports = OrderService;
