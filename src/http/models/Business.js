const mongoose = require('mongoose');
const Address = require('./Address');
const Logistics = require('./Logistics');
const timestamp = require('./plugins/timestamp');
const { Schema } = mongoose;

const businessSchema = new Schema({
  accountId: {
    type: mongoose.Types.ObjectId,
    ref: 'Account',
  },
  address: {
    type: mongoose.Types.ObjectId,
    ref: Address,
  },
  logisticsId: {
    type: mongoose.Types.ObjectId,
    ref: Logistics,
  },
  type: {
    type: String,
  },
  name: {
    type: String,
  },
  cacNumber: {
    type: String,
  },
  state: {
    type: String,
  },
  lga: {
    type: String,
  },
});

businessSchema.plugin(timestamp);

const businessModel = mongoose.model('Business', businessSchema);
module.exports = businessModel;
