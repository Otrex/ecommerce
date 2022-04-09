const mongoose = require('mongoose');
const timestamp = require('./plugins/timestamp');

const productSchema = new mongoose.Schema(
  {
    creatorId: {
      type: mongoose.Types.ObjectId,
    },
    imageUrl: String,
    name: String,
    categoryId: {
      type: mongoose.Types.ObjectId,
      ref: 'Category',
    },
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

    confirmation: {
      boolean: false,
    },
  },
  { timestamps: true }
);

productSchema.plugin(timestamp);
module.exports = mongoose.model('product', productSchema);
