const mongoose = require('mongoose');
const timestamp = require('./plugins/timestamp');
const {
  ORDER_STATUS,
  TRANSACTION_STATUS,
} = require('../../constants');

const TransactionSchema = new mongoose.Schema(
  {
    amount: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: Object.values(TRANSACTION_STATUS),
      default: TRANSACTION_STATUS.PENDING,
    },
    reference: {
      type: String,
    },
  },
  { timestamps: true }
);

TransactionSchema.plugin(timestamp);
module.exports = mongoose.model('Transaction', TransactionSchema);
