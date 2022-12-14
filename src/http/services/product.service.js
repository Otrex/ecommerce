const { NotFoundError, ServiceError } = require('../lib/exceptions');
const { calcSkip, paginateResponse } = require('../../scripts/utils');
const { PRODUCT_STATUS, ORDER_STATUS } = require('../../constants');
const ObjectId = require('mongoose').Types.ObjectId;
const models = require('../models');
const moment = require('moment');
const { omit, pick } = require('lodash');
const { filterDates } = require('../../scripts/utils');

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
      data: omit(product.toObject(), ['creatorId']),
    };
  };

  static getProducts_Business = async ({
    account,
    status,
    limit,
    page,
  }) => {
    const vendor = await models.Business.findOne({
      accountId: account._id,
    });
    if (!vendor) throw new NotFoundError('vendor not found');

    const statusArray = status.split(',');

    const query = {
      creatorId: vendor._id,
      status: {
        $in: statusArray,
      },
    };

    const skip = calcSkip({ page, limit });
    const count = await models.Product.count(query);
    const products = await models.Product.find(query, null, {
      skip,
      limit,
    });

    const _products = products.map((product) => ({
      ...omit(product.toJSON(), ['creatorId']),
    }));

    return paginateResponse([_products, count], page, limit);
  };

  static approveProduct = async ({ productId }) => {
    const product = await models.Product.findOne({ _id: productId });
    if (!product) throw new NotFoundError('produt not found');

    await models.Product.findByIdAndUpdate(product._id, {
      status: PRODUCT_STATUS.APPROVED,
    });

    return {
      message: 'product has been approved',
    };
  };

  static likeProduct = async ({ account, productId }) => {
    const product = await models.Product.findOne({ _id: productId });
    if (!product) throw new NotFoundError('product not found');

    const customer = await models.Customer.findOne({
      accountId: account._id,
    });

    if (!customer) throw new NotFoundError('customer not found');

    const isliked = await models.CustomerFavorite.findOne({
      productId: new ObjectId(productId),
      customerId: customer._id,
    });

    if (isliked) throw new ServiceError('product is already liked');
    await models.CustomerFavorite.create({
      productId: new ObjectId(productId),
      customerId: customer._id,
    });

    return {
      message: 'product has been liked successfully',
    };
  };

  static getFavorites = async ({ account, page, limit }) => {
    const customer = await models.Customer.findOne({
      accountId: account._id,
    });

    if (!customer) throw new NotFoundError('customer not found');

    // TODO add feeback ratings
    const skip = calcSkip({ page, limit });
    const clause = { customerId: customer._id };
    const count = await models.CustomerFavorite.count(clause);
    const result = await models.CustomerFavorite.find(clause, null, {
      limit,
      skip,
    })
      .populate({
        path: 'productId',
        select: [
          'price',
          'name',
          'feedback',
          'imageUrl',
          'description',
          '_id',
        ],
      })
      .exec();

    const _result = result.map((r) => ({
      ...r.productId._doc,
    }));

    return paginateResponse([_result, count], page, limit);
  };

  static getProductByCategory = async ({
    categoryId,
    page,
    limit,
  }) => {
    const category = await models.Category.findById(categoryId);
    if (!category) throw new NotFoundError('category not found');

    const skip = calcSkip({ page, limit });
    const clause = {
      categoryId: category._id,
      status: PRODUCT_STATUS.APPROVED,
    };
    const products = await models.Product.find(clause, null, {
      skip,
      limit,
    });
    const count = await models.Product.count(clause);

    const _products = products.map((product) => ({
      ...omit(product.toJSON(), ['creatorId']),
    }));

    return paginateResponse([_products, count], page, limit);
  };

  static getCategoryStats = async ({ page, limit }) => {
    const skip = calcSkip({ page, limit });
    const [data] = await models.Category.aggregate([
      {
        $lookup: {
          from: models.Product.collection.collectionName,
          localField: '_id',
          foreignField: 'categoryId',
          as: 'product',
          pipeline: [
            {
              $group: {
                _id: null,
                totalProducts: { $sum: 1 },
                totalProductQuantity: { $sum: '$quantity' },
              },
            },
            { $project: { _id: 0 } },
          ],
        },
      },
      {
        $addFields: {
          statistics: {
            $arrayElemAt: ['$product', 0],
          },
        },
      },
      {
        $project: {
          product: 0,
        },
      },
      {
        $facet: {
          categories: [{ $skip: skip }, { $limit: limit }],
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

    const totalProducts = await models.Product.countDocuments();
    const categories = data ? [data.categories, data.count] : [[], 0];
    return {
      data: {
        categories: paginateResponse(categories, page, limit),
        totalProducts,
      },
    };
  };

  // TODO :: ship out
  static getCategoryStats_Vendor = async ({ account, page, limit }) => {
    const skip = calcSkip({ page, limit });
    const vendor = await models.Business.findOne({
      accountId: account._id,
    });
    if (!vendor) throw new NotFoundError('vendor not found');

    const [data] = await models.Category.aggregate([
      {
        $lookup: {
          from: models.Product.collection.collectionName,
          localField: '_id',
          foreignField: 'categoryId',
          as: 'product',
          pipeline: [
            {
              $group: {
                _id: null,
                totalProducts: { $sum: 1 },
                totalProductQuantity: { $sum: '$quantity' },
              },
            },
            { $project: { _id: 0 } },
          ],
        },
      },
      {
        $match: {
          'product.creatorId': vendor._id,
        }
      },
      {
        $addFields: {
          statistics: {
            $arrayElemAt: ['$product', 0],
          },
        },
      },
      {
        $project: {
          product: 0,
        },
      },
      {
        $facet: {
          categories: [{ $skip: skip }, { $limit: limit }],
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

    const totalProducts = await models.Product.countDocuments();
    const categories = data ? [data.categories, data.count] : [[], 0];
    return {
      data: {
        categories: paginateResponse(categories, page, limit),
        totalProducts,
      },
    };
  };

  static getProductDetails = async ({ productId }) => {
    const product = await models.Product.findOne({ _id: productId });
    if (!product) throw new NotFoundError('product not found');

    return {
      data: product,
    };
  };

  static disapproveProduct = async ({ productId, reason }) => {
    const product = await models.Product.findOne({ _id: productId });
    if (!product) throw new NotFoundError('product not found');

    await models.Product.findByIdAndUpdate(product._id, {
      status: PRODUCT_STATUS.DISSAPPROVED,
      reasonForDisapproval: reason,
    });

    return {
      message: 'product has been approved',
    };
  };

  static addFeedback = async ({
    productId,
    rating,
    comment,
    account,
  }) => {
    const product = await models.Product.findOne({ _id: productId });
    if (!product) throw new NotFoundError('product not found');

    const customer = await models.Customer.findOne({
      accountId: account._id,
    });

    if (!customer) throw new NotFoundError('customer not found');

    const feedback = await product.feedback.create({
      customerId: customer._id,
      comment,
      rating,
    });

    product.feedback.push(feedback);
    await product.save();

    return {
      message: 'feedback added successfully',
    };
  };

  static getApprovedProducts_Public = async ({ page, limit }) => {
    const skip = calcSkip({ page, limit });
    const clause = { status: PRODUCT_STATUS.APPROVED };
    const products = await models.Product.find(clause, null, {
      skip,
      limit,
    });
    const count = await models.Product.count(clause);
    const _products = products.map((product) => ({
      ...omit(product.toJSON(), ['creatorId']),
    }));

    return paginateResponse([_products, count], page, limit);
  };

  static getFeedback = async ({ account, page, limit }) => {
    const vendor = await models.Business.findOne({
      accountId: account._id,
    });
    if (!vendor) throw new NotFoundError('vendor not found');

    const query = {
      creatorId: vendor._id,
      status: PRODUCT_STATUS.APPROVED,
    };

    const skip = calcSkip({ page, limit });
    const count = await models.Product.count(query);
    const products = await models.Product.find(query, null, {
      skip,
      limit,
    }).populate('categoryId');

    const _products = products.map((product) => ({
      ...omit(product.toJSON(), [
        'reasonForDisapproval',
        'handlingFee',
        'creatorId',
        'discount',
      ]),
      avgRating: product.feedback.length
        ? product.feedback.reduce((t, e) => t + e.rating, 0) /
          product.feedback.length
        : 0,
      category: product.categoryId,
    }));

    return paginateResponse([_products, count], page, limit);
  };

  static getFeedback_Admin = async ({ page, limit }) => {
    const query = {
      status: PRODUCT_STATUS.APPROVED,
    };

    const skip = calcSkip({ page, limit });
    const count = await models.Product.count(query);
    const products = await models.Product.find(query, null, {
      skip,
      limit,
    }).populate('categoryId');

    const _products = products.map((product) => ({
      ...omit(product.toJSON(), [
        'reasonForDisapproval',
        'handlingFee',
        'creatorId',
        'discount',
      ]),
      avgRating: product.feedback.length
        ? product.feedback.reduce((t, e) => t + e.rating, 0) /
          product.feedback.length
        : 0,
      noOfComments: product.feedback.length,
      category: product.categoryId,
    }));

    return paginateResponse([_products, count], page, limit);
  };

  static getProductsAdmin = async ({ page, limit }) => {
    const skip = calcSkip({ page, limit });
    const products = await models.Product.find({}, null, {
      skip,
      limit,
    }).populate('categoryId');

    return {
      data: products.map((p) => ({
        ...pick(p, [
          'price',
          'status',
          'name',
          'imageUrl',
          'description',
          'quantity',
        ]),
        category: p.categoryId,
      })),
    };
  };

  static searchForProduct = async ({ query, page, limit }) => {
    const skip = calcSkip({ page, limit });

    const [result] = await models.Product.aggregate([
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
        $match: {
          $or: [
            { name: { $regex: new RegExp(`${query}`, 'gi') } },
            {
              'category.name': {
                $regex: new RegExp(`${query}`, 'gi'),
              },
            },
          ],
        },
      },
      {
        $facet: {
          products: [{ $skip: skip }, { $limit: limit }],
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

    const products = result
      ? [result.products, result.count]
      : [[], 0];
    return paginateResponse(products, page, limit);
  };

  static getReviewGeneralStats = async () => {
    const totalNoOfReviews = await models.Product.countDocuments({
      $expr: { $gt: [{ $size: '$feedback' }, 0] },
    });

    const [totalCategoriesReviewed] = await models.Category.aggregate(
      [
        {
          $lookup: {
            from: models.Product.collection.collectionName,
            localField: '_id',
            foreignField: 'categoryId',
            as: 'product',
          },
        },
        { $unwind: '$product' },
        {
          $match: {
            $expr: { $gt: [{ $size: '$product.feedback' }, 0] },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
          },
        },
        { $project: { _id: 0 } },
      ]
    );

    // TODO fix this for those with totalNoOfReviews
    return {
      data: {
        totalNoOfReviews,
        totalCustomerComments: totalNoOfReviews,
        totalProductsReviewed: totalNoOfReviews,
        totalCategoriesReviewed: totalCategoriesReviewed
          ? totalCategoriesReviewed.total
          : 0,
      },
    };
  };

  static grossProductStats = async () => {
    const [result] = await models.Product.aggregate([
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
        $addFields: {
          totalProductCost: {
            $multiply: ['$price', '$quantity'],
          },
        },
      },
      {
        $addFields: {
          totalSoldProductCost: {
            $multiply: [
              { $subtract: ['$quantity', '$quantityLeft'] },
              '$price',
            ],
          },
        },
      },
      {
        $group: {
          _id: null,
          grossMerchandise: { $sum: '$totalProductCost' },
          grossProductSales: { $sum: '$totalSoldProductCost' },
        },
      },
      { $project: { _id: 0 } },
    ]);

    const startDate = moment().subtract(16, 'week').toDate();
    const chart = await models.Product.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
          },
        },
      },
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
        $addFields: {
          totalProductCost: {
            $multiply: ['$price', '$quantity'],
          },
        },
      },
      {
        $addFields: {
          totalSoldProductCost: {
            $multiply: [
              { $subtract: ['$quantity', '$quantityLeft'] },
              '$price',
            ],
          },
        },
      },
      {
        $project: {
          totalProductCost: 1,
          totalSoldProductCost: 1,
          createdAt: 1,
        },
      },
    ]);

    return {
      data: {
        grossStats: result ? result : null,
        chart: filterDates(chart, 'startOftheWeek'),
        startDate,
      },
    };
  };
}

module.exports = ProductService;
