const {
  ServiceError,
  NotFoundError 
} = require('../lib/exceptions');
const models = require('../models');
const { omit } = require('lodash');
const { PRODUCT_STATUS } = require('../../constants');

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
}

module.exports = CartService;
