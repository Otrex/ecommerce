const mongoose = require('mongoose');
const { Schema } = mongoose;

const LogisticsSchema = new Schema({
  costPerUnit: {
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

module.exports = mongoose.model('Logistics', LogisticsSchema);
