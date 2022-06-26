const mongoose = require('mongoose');
const { ORDER_STATUS } = require('../../constants');

const orderSchema = new mongoose.Schema(
  {
    ref: {
      type: String,
    },
    productId: {
      type: mongoose.Types.ObjectId,
      ref: 'Product',
    },
    accountId: {
      type: mongoose.Types.ObjectId,
      ref: 'Account',
    },
    address: {
      type: mongoose.Types.ObjectId,
      ref: 'Address',
    },
    quantity: {
      type: Number,
      default: 0,
    },
    totalCost: {
      type: Number,
      default: 0,
    },
    totalTransportCost: {
      type: Number,
      default: 0,
    },
    distance: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
