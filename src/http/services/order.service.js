const { NotFoundError, ServiceError } = require('../lib/exceptions');
const models = require('../models');
const { ORDER_STATUS } = require('../../constants');

class OrderService {
  static getOrderCount = async (status) => {
    const [result] = await models.Order.aggregate([
      {
        $lookup: {
          from: Job.collection.collectionName,
          localField: 'productId',
          foreignField: '_id',
          as: 'product',
          pipeline: [
            {
              $match: {
                creatorId: vendor._id
              },
            }
          ],
        },
      },
      { $unwind: '$product' },
      {
        $match: {
          status
        }
      },
      { $count: "total" },
      { 
        $project: {
          total: 1
        }
      }
    ])

    return result ? result.total: 0
  }

  static stats = async ({ account }) => {
    const vendor = await models.Business.findOne({
      accountId: account._id,
    });
    if (!vendor) throw new NotFoundError('vendor not found');

    // const pendingOrders = await OrderService.getOrderCount(ORDER_STATUS.PENDING);
    // const canceledOrders = await OrderService.getOrderCount(ORDER_STATUS.CANCELLED);
    // const incompleteOrders = await OrderService.getOrderCount(ORDER_STATUS.INCOMPLETED);
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
                creatorId: vendor._id
              },
            }
          ],
        },
      },
      {
        $group: {
          _id: '$status',
          totalQuantity: { $sum: '$quantity' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    let productsSold = 0;
    let cancelledOrders = 0;
    let pendingOrders = 0;
    let incompleteOrders = 0;

    if (result) {
      productsSold = result.find(e => e._id === ORDER_STATUS.SHIPPED)?.totalQuantity || 0;
      incompleteOrders = result.find(e => e._id === ORDER_STATUS.INCOMPLETED)?.count || 0;
      cancelledOrders = result.find(e => e._id === ORDER_STATUS.CANCELLED)?.count || 0;
      pendingOrders = result.find(e => e._id === ORDER_STATUS.PENDING)?.count || 0;
    }
    
    return {
      data: {
        productsSold,
        cancelledOrders,
        incompleteOrders,
        pendingOrders
      }
    }
  };
}


module.exports = OrderService;