const { NotFoundError } = require('../lib/exceptions');
const models = require('../models');
const { omit } = require('lodash');
const { calcSkip, paginateResponse } = require('../../scripts/utils');
const ObjectId = require('mongoose').Types.ObjectId;

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
      ...omit(product, ['feedbackId', 'creatorId']),
    }))

    return paginateResponse([_products, count], page, limit)
  };
}

module.exports = ProductService;
