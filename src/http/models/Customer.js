const mongoose = require('mongoose');
const Address = require('./Address');
const timestamp = require('./plugins/timestamp');
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
});

customerSchema.plugin(timestamp);

const itemModel = mongoose.model('Customer', customerSchema);
module.exports = itemModel;
