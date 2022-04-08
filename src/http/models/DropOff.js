const mongoose = require('mongoose');
const timestamp = require('./plugins/timestamp');

const dropOffSchema = new mongoose.Schema(
  {
    accountId: {
      type: mongoose.Types.ObjectId,
    },

    items: [
      {
        categoryId: {
          type: mongoose.Types.ObjectId,
          ref: 'categories',
        },
        weightId: {
          type: mongoose.Types.ObjectId,
          ref: 'weight',
        },
        quantity: {
          type: Number,
        },
      },
    ],

    type: {
      type: String,
      enum: ['express', 'scheduled'],
    },
    // paymentMethod varchar [ref: - p.id]
    price: {
      type: Number,
      default: 0,
    },
    orderNo: {
      type: Number,
      default: 0,
    },
    state: {
      type: String,
      enum: ['drafted', 'submited'],
    },
    status: {
      type: String,
      enum: ['completed', 'saved'],
    },
    timeline: [
      {
        time: {
          type: Date,
        },
        status: {
          type: String,
          enum: ['user', 'admin'],
        },
      },
    ],
    // destination varchar [ref: - destination.id]
    // estimatedDeliveryTime timestamp [null]
    // pickup varchar [null, ref: - pickup.id]
    // created_at timestamp
    // updated_at timestamp

    confirmation: {
      boolean: false,
    },
  },
  { timestamps: true }
);

dropOffSchema.plugin(timestamp);

const DropOff = mongoose.model('DropOff', dropOffSchema);

module.exports = DropOff;
