const mongoose = require('mongoose');

const { Schema } = mongoose;
const feedbackSchema = new Schema({
  ratings: {
    type: Number,
  },
  comment: {
    type: Number,
  },
  customer: {
    type: mongoose.Types.ObjectId,
    ref: 'Customer',
  },
});

const feedback = mongoose.model('Feedback', feedbackSchema);
module.exports = feedback;
