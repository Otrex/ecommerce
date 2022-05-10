const mongoose = require('mongoose');
const Address = require('./Address');
const timestamp = require('./plugins/timestamp');
const { Schema } = mongoose;

const customerFavoriteSchema = new Schema({
  customerId: {
    type: mongoose.Types.ObjectId,
    ref: 'Customer',
  },
  productId: {
    type: mongoose.Types.ObjectId,
    ref: 'Product',
  },
});

customerFavoriteSchema.plugin(timestamp);

const customerFavoriteModel = mongoose.model(
  'CustomerFavorite',
  customerFavoriteSchema
);
module.exports = customerFavoriteModel;
