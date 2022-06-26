const mongoose = require('mongoose');
const { Schema } = mongoose;

const addressSchema = new Schema({
  lat: {
    type: Number,
  },
  lng: {
    type: Number,
  },
  fullAddress: {
    type: String,
  },
  country: {
    type: String,
  },
  city: {
    type: String,
  },
  state: {
    type: String,
  },
  street: {
    type: String,
  }
});

const address = mongoose.model('Address', addressSchema);
module.exports = address;
