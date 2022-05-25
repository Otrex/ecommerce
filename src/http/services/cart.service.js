const { ServiceError, NotFoundError } = require('../lib/exceptions');
const models = require('../models');
const { omit } = require('lodash');
const { PRODUCT_STATUS } = require('../../constants');
const Paystack = require('paystack-api-ts').default;
const config = require('../../config');
const { distanceBtwPoints } = require('./../../scripts/utils')

const paystack = new Paystack(config.paystack.key);

class CartService {
  static getCart = async ({ account }) => {
    const customer = await models.Customer.findOne({
      accountId: account._id,
    });

    if (!customer) throw new NotFoundError('customer not found');

    const cart = await models.Cart.find({ customerId: customer._id })
      .populate({
        path: 'productId',
        select: [
          'price',
          'categoryId',
          'weight',
          'description',
          'name',
          'imageUrl',
          'creatorId',
        ],
        populate: {
          path: 'categoryId',
        },
      })
      .exec();

    return {
      data: cart.map((_cart) => {
        _cart = _cart.toJSON();
        return {
          ...omit(_cart, ['productId', 'customerId']),
          product: {
            ...omit(_cart.productId, ['categoryId']),
            category: _cart.productId.categoryId,
          },
        };
      }),
    };
  };

  static addToCart = async ({ productId, account, quantity }) => {
    const product = await models.Product.findById(productId);
    if (!product) throw new NotFoundError('product not found');
    const customer = await models.Customer.findOne({
      accountId: account._id,
    });
    if (!customer) throw new NotFoundError('customer not found');

    if (product.status !== PRODUCT_STATUS.APPROVED) {
      throw new ServiceError(
        'product has not been approved by admin'
      );
    }

    if (product.quantityLeft === 0) {
      throw new ServiceError('out of stock');
    }

    if (product.quantityLeft < quantity) {
      throw new ServiceError(
        `there are only ${product.quantityLeft} of this product left`
      );
    }

    let cart = await models.Cart.findOne({
      customerId: customer._id,
      productId,
    });

    if (!cart) {
      cart = await models.Cart.create({
        customerId: customer._id,
        productId,
      });
    }

    await models.Cart.updateOne(
      { _id: cart._id },
      {
        quantity,
      }
    );

    const data = await CartService.getCart({ account });

    return {
      ...data,
      message: 'item has been added to cart successfully',
    };
  };

  static checkoutCart = async ({ account }) => {
    const { data } = await CartService.getCheckoutDetails({ account });
    const { totalCost, totalDistanceCost } = data;
    const amount = Math.ceil(totalCost * totalDistanceCost);

    if (('' + amount).length > 7) throw new ServiceError('total cost has exceeded the a million and cant be carried out. Please contact support')
    const transaction = await models.Transaction.create({
      amount,
    });

    const paymentInit = await paystack.transaction.initialize({
      metadata: { transactionId: transaction._id },
      amount: `${amount * 100}`,
      email: account.email,
    });

    await models.Transaction.findByIdAndUpdate(transaction._id, {
      reference: paymentInit.reference,
    });

    return {
      authorizationUrl: paymentInit.authorizationUrl,
      accessCode: paymentInit.accessCode,
      transactionId: transaction.id,
    };
  };

  static getCheckoutDetails = async ({ account }) => {
    const { data } = await CartService.getCart({ account });
    if (!data.length) throw new ServiceError('no item in cart');

    // Get customer address
    const { address: customerAddress } = await models.Customer.findOne({
      accountId: account._id,
    }).populate('address').exec();

    // distanceState contains the calculated distance 
    // for each unique product and the frequency of product
    // as well as the totalWeight in KG
    const distanceState = {};
    for (const item of data ) {
      const business = await models.Business
        .findById(item.product.creatorId)
        .populate('logisticsId')
        .populate('address')
        .exec();

      // Get Each business Address
      let { logisticsId: logistics, address: businessAddress } = business;
      if (!logistics) logistics = await models.Logistics.findOne({ default: true });

      const distance = distanceBtwPoints(
        businessAddress.lat,
        customerAddress.lat,
        businessAddress.lng,
        customerAddress.lng,
      );
      
      distanceState[item.product._id.toString()] = {
        productTotaldiscount: ((item.product.discount || 0) * item.product.price * item.quantity) / 100,
        distanceCost: logistics.cost ? (item.product.weight * item.quantity * distance)/logistics.cost: 0, /// Calculates cost for delivering a product :: (weight*quantity*distance)/ costoftransport_in_kmKg
        productTotalPrice: item.product.price * item.quantity,
        occurence: 1,
        distance,
      }
    }

    console.log(distanceState)

    return {
      data: {
        totalCost: Object.entries(distanceState)
          .map(([k, v]) => v.productTotalPrice - v.productTotaldiscount)
          .reduce((t, c) => t + c, 0),
        
        totalDistanceCost: Object.entries(distanceState)
          .map(([k, v]) => v.distanceCost)
          .reduce((t, c) => t + c, 0)
      }
    }

  }
}

module.exports = CartService;
