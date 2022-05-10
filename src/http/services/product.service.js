const { NotFoundError, ServiceError } = require('../lib/exceptions');
const models = require('../models');
const { omit } = require('lodash');
const { calcSkip, paginateResponse } = require('../../scripts/utils');
const ObjectId = require('mongoose').Types.ObjectId;
const { PRODUCT_STATUS } = require('../../constants');

class ProductService {
  static createProduct = async ({
    account,
    imageUrl,
    name,
    categoryId,
    price,
    weight,
    quantity,
    expiryDate,
    minimumOrder,
    handlingFee,
    description,
  }) => {
    const vendor = await models.Business.findOne({
      accountId: account._id,
    });
    if (!vendor) throw new NotFoundError('vendor not found');

    const category = await models.Category.findOne({
      _id: ObjectId(categoryId),
    });
    if (!category) throw new NotFoundError('category not found');

    const product = await models.Product.create({
      name,
      price,
      weight,
      quantity,
      imageUrl,
      expiryDate,
      description,
      handlingFee,
      minimumOrder,
      creatorId: vendor._id,
      quantityLeft: quantity,
      category: category._id,
    });

    return { 
      data: omit(product.toObject(), [
        'feedbackId',
        'creatorId',
      ]) 
    };
  };

  static getProducts_Business = async ({ account, status, limit, page }) => {
    const vendor = await models.Business.findOne({
      accountId: account._id,
    });
    if (!vendor) throw new NotFoundError('vendor not found');

    const statusArray = status.split(',');

    const query = {
      creatorId: vendor._id,
      status: {
        $in: statusArray
      }
    };

    const skip = calcSkip({ page, limit });
    const count = await models.Product.count(query);
    const products = await models.Product.find(query, null, {
      skip,
      limit
    });

    const _products = products.map(product => ({
      ...omit(product.toJSON(), ['feedbackId', 'creatorId']),
    }))

    return paginateResponse([_products, count], page, limit)
  };

  static approveProduct = async ({ productId }) => {
    const product = await models.Product.findOne({ _id: productId });
    if (!product) throw new NotFoundError('produt not found');

    await models.Product.findByIdAndUpdate(product._id, {
      status: PRODUCT_STATUS.APPROVED
    });

    return {
      message: 'product has been approved'
    }
  }

  static likeProduct = async ({ account, productId }) => {
    const product = await models.Product.findOne({ _id: productId });
    if (!product) throw new NotFoundError('produt not found');

    const customer = await models.Customer.findOne({
      accountId: account._id,
    });

    if (!customer) throw new NotFoundError('customer not found');

    const isliked = await models.CustomerFavorite.findOne({
      productId: new ObjectId(productId),
      customerId: customer._id
    });

    if (isliked) throw new ServiceError('product is already liked')
    await models.CustomerFavorite.create({
      productId: new ObjectId(productId),
      customerId: customer._id
    })

    return {
      message: 'product has been liked successfully'
    }
  }
}

module.exports = ProductService;
