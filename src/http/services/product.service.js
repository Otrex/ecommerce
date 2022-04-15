const { NotFoundError } = require('../lib/exceptions');
const models = require('../models');
const { omit } = require('lodash');
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

  static getProducts_Business = async ({ account }) => {
    const vendor = await models.Business.findOne({
      accountId: account._id,
    });
    if (!vendor) throw new NotFoundError('vendor not found');

    // TODO paginate
    const products = await models.Product.find({
      creatorId: vendor._id,
    });
  };
}

module.exports = ProductService;
