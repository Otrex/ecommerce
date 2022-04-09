const mongoose = require('mongoose');
const { Schema } = mongoose;

const addressSchema = new Schema({
  lat: {
    type: Number,
  },
  long: {
    type: Number,
  },
  value: {
    type: String,
  },
});

const address = mongoose.model('Address', addressSchema);
module.exports = address;
