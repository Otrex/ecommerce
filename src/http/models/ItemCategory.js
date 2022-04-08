const mongoose = require('mongoose');
const { Schema } = mongoose;
const timestamp = require('./plugins/timestamp');

const itemCategorySchema = new Schema({
  name: {
    type: String,
    unique: true,
  },
});

itemCategorySchema.plugin(timestamp);

const itemModel = mongoose.model('ItemCategory', itemCategorySchema);
module.exports = itemModel;
