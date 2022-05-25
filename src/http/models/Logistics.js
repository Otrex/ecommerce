const mongoose = require('mongoose');
const { Schema } = mongoose;

const LogisticsSchema = new Schema({
  cost: {
    // For 1kg and 1km
    type: Number,
  },
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  default: {
    type: Boolean,
    default: false,
  },
});

const Logistics = mongoose.model('Logistics', LogisticsSchema);
module.exports = Logistics;
