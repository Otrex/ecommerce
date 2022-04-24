const mongoose = require('mongoose');
const timestamp = require('./plugins/timestamp');
const { PRODUCT_STATUS } = require('../../constants');

const cartSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Types.ObjectId,
      ref: 'Account',
    },
    productId: {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
    },
    quantity: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

cartSchema.plugin(timestamp);
module.exports = mongoose.model('Cart', cartSchema);
