const mongoose = require('mongoose');
const Address = require('./Address');
const { Schema } = mongoose;

const customerSchema = new Schema({
  accountId: {
    type: mongoose.Types.ObjectId,
    ref: 'Account',
  },
  address: {
    type: mongoose.Types.ObjectId,
    ref: Address,
  },
  gender: {
    type: String,
  },
});

const customerModel = mongoose.model('Customer', customerSchema);
module.exports = customerModel;
