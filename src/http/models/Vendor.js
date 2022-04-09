const mongoose = require('mongoose');
const timestamp = require('./plugins/timestamp');
const Address = require('./Address');

const vendorSchema = new mongoose.Schema({
  accountId: {
    type: mongoose.Types.ObjectId,
    ref: 'Account',
  },

  name: {
    type: String,
    required: true,
  },

  type: {
    type: String, // supposed to be enum
    required: true,
  },

  cacRegNo: {
    type: String,
    unique: true,
  },

  state: {
    type: String,
  },

  lga: {
    type: String,
  },

  address: {
    type: mongoose.Types.ObjectId,
    ref: Address
  },
});

vendorSchema.plugin(timestamp);

const vendorModel = mongoose.model('Vendor', vendorSchema);

module.exports = vendorModel;
