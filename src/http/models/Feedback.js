const mongoose = require('mongoose');
const timestamp = require('./plugins/timestamp');

const { Schema } = mongoose;
const feedbackSchema = new Schema({
  rating: {
    type: Number,
  },
  comment: {
    type: String,
  },
  customerId: {
    type: mongoose.Types.ObjectId,
    ref: 'Customer',
  },
});

feedbackSchema.plugin(timestamp);

module.exports = feedbackSchema;
