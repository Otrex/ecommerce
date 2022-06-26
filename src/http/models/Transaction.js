const mongoose = require('mongoose');

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

module.exports = mongoose.model('Transaction', TransactionSchema);
