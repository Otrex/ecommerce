const mongoose = require('mongoose');
const timestamp = require('./plugins/timestamp');

const accountSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },

  lastPasswordReset: {
    type: Date,
  },

  password: {
    type: String,
    required: true,
    select: false,
  },

  isVerified: {
    type: Boolean,
    default: false,
  },

  verifiedAt: {
    type: Date,
  },

  ip: {
    type: String,
  },

  lastLoggedIn: {
    type: Date,
    default: new Date(),
  },

  sessionID: {
    type: String,
  },

  profileImage: { type: String },

  type: {
    type: String,
    enum: ['rider', 'client'],
    default: 'client',
  },
});

accountSchema.plugin(timestamp);

const accountModel = mongoose.model('Account', accountSchema);

module.exports = accountModel;
