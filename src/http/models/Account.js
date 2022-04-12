const mongoose = require('mongoose');
const { ACCOUNT_TYPES } = require('../../constants');
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

  isEmailVerified: {
    type: Boolean,
    default: false,
  },

  verifiedEmailAt: {
    type: Date,
  },

  lastLoggedIn: {
    type: Date,
    default: new Date(),
  },

  profileImage: { type: String },

  type: {
    type: String,
    enum: Object.values(ACCOUNT_TYPES),
    default: ACCOUNT_TYPES.CUSTOMER,
  },

  isActive: {
    type: Boolean,
    default: false,
  },

  isSuperAdmin: {
    type: Boolean,
    default: false,
  },
});

accountSchema.plugin(timestamp);

const accountModel = mongoose.model('Account', accountSchema);

module.exports = accountModel;
