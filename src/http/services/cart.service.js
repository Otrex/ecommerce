const {
  ServiceError,
  NotFoundError 
} = require('../lib/exceptions');
const models = require('../models');
const { omit } = require('lodash');
const { PRODUCT_STATUS } = require('../../constants');
const Paystack = require('paystack-api-ts').default;
const config = require('../../config');


const paystack = new Paystack(config.paystack.key);

class CartService {
  static getCart = async ({ account }) => {
    const cart = await models.Cart.find({ customerId: account._id })
    .populate({
      path: 'productId', 
      select: [
        'price',
        'categoryId',
        'weight',
        'description', 
        'name', 
        'imageUrl' 
      ],
      populate: {
        path: 'categoryId'
      }
    })
    .exec();

    return {
      data: cart.map((_cart) => {
        _cart = _cart.toJSON()
        return {
          ...omit(_cart, ['productId', 'customerId']), 
          product: { 
            ...omit(_cart.productId, ['categoryId']),
            category: _cart.productId.categoryId
          },
        }
      })
    }
  };

  static addToCart = async ({ productId, account, quantity }) => {
    const product = await models.Product.findById(productId);
    if (!product) throw new NotFoundError('product not found');

    if (product.status !== PRODUCT_STATUS.APPROVED) {
      throw new ServiceError('product has not been approved by admin');
    }

    if (product.quantityLeft === 0) {
      throw new ServiceError('out of stock');
    }

    if (product.quantityLeft < quantity) {
      throw new ServiceError(`there are only ${product.quantityLeft} of this product left`)
    }

    let cart = await models.Cart.findOne({
      customerId: account._id,
      productId,
    });

    if (!cart) {
      cart = await models.Cart.create({
        customerId: account._id,
        productId,
      })
    }

    await models.Cart.updateOne({ _id: cart._id }, {
      quantity
    });

    const data = await CartService.getCart({ account });
    
    return {
      ...data,
      message: 'item has been added to cart successfully'
    }
  }

  static checkoutCart = async ({ account }) => {
    const {data} = await CartService.getCart({ account });
    if (!data.length) throw new ServiceError('no item in cart');

    const amount = data.reduce((total, cart) => (
      total + (cart.quantity * cart.product.price)
    ), 0);

    const transaction = await models.Transaction.create({
      amount
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
  }
}

module.exports = CartService;
