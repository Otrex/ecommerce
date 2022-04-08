const mongoose = require('mongoose');
const timestamp = require('./plugins/timestamp');

const timedTokenSchema = new mongoose.Schema({
  accountId: {
    type: mongoose.Types.ObjectId,
    ref: "Account"
  },
  type: {
    type: String,
    required: true,
  },
  token: {
    type: String,
    required: true,
  },

  expiryTimestamp: {
    type: Number,
  },
  
  isUsed: {
    type: Boolean,
    default: false
  },
});

timedTokenSchema.plugin(timestamp);

const timedTokenModel = mongoose.model('TimedToken', timedTokenSchema);

module.exports = timedTokenModel;
