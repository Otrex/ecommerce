const mongoose = require('mongoose');
const Address = require('./Address');
const timestamp = require('./plugins/timestamp');
const { Schema } = mongoose;

const businessPaymentSchema = new Schema({
  businessId: {
    type: mongoose.Types.ObjectId,
    ref: 'Business',
  },
  accountNumber: {
    type: String,
  },
  bank: {
    type: String,
  },
  accountName: {
    type: String
  },
  payoutFrequency: { // in days
    type: Number
  }
});

businessPaymentSchema.plugin(timestamp);

const businessPaymentModel = mongoose.model('BusinessPayment', businessPaymentSchema);
module.exports = businessPaymentModel;
