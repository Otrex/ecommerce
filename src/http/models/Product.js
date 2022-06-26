const mongoose = require('mongoose');
const timestamp = require('./plugins/timestamp');
const FeedbackSchema = require('./Feedback');
const { PRODUCT_STATUS } = require('../../constants');

const productSchema = new mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Types.ObjectId,
      ref: 'Business',
    },
    imageUrl: String,
    name: String,
    feedback: [FeedbackSchema],
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
    reasonForDisapproval: {
      type: String,
    },
    discount: {
      // In percewnt
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: Object.values(PRODUCT_STATUS),
      default: PRODUCT_STATUS.PENDING,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
