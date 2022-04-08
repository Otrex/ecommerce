const mongoose = require('mongoose');
const { Schema } = mongoose;
const timestamp = require('./plugins/timestamp');

const itemWeightSchema = new Schema({
  value: {
    type: String,
  },
});

itemWeightSchema.plugin(timestamp);

const itemModel = mongoose.model('ItemWeight', itemWeightSchema);
module.exports = itemModel;
