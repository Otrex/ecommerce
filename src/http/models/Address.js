const mongoose = require('mongoose');
const { Schema } = mongoose;

const addressSchema = new Schema({
  lat: {
    type: Number,
  },
  lng: {
    type: Number,
  },
  label: {
    type: String,
  },
});

const address = mongoose.model('Address', addressSchema);
module.exports = address;
