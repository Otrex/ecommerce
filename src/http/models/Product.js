const mongoose = require('mongoose');
const timestamp = require('./plugins/timestamp');
const { PRODUCT_STATUS } = require('../../constants');

const productSchema = new mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Types.ObjectId,
      ref: 'Business',
    },
    imageUrl: String,
    name: String,
    feedbackId: [
      {
        type: mongoose.Types.ObjectId,
        ref: 'FeedBack',
      },
    ],
    categoryId: {
      type: mongoose.Types.ObjectId,
      ref: 'Category',
    },
    price: {
      type: Number,
      default: 0,
    },
    weight: {
      type: Number,
      default: 0,
    },
    quantityLeft: {
      type: Number,
      default: 0,
    },
    quantity: {
      type: Number,
      default: 0,
    },
    expiryDate: {
      type: Date,
    },
    minimumOrder: {
      type: Number,
      default: 0,
    },
    handlingFee: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: Object.values(PRODUCT_STATUS),
      default: PRODUCT_STATUS.PENDING,
    },
  },
  { timestamps: true }
);

productSchema.plugin(timestamp);
module.exports = mongoose.model('Product', productSchema);
