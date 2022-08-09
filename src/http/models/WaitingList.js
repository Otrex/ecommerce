const mongoose = require('mongoose');
const { Schema } = mongoose;

const WaitingListSchema = new Schema({
  email: {
    type: String,
  },
  otherDetails: {
    type: Schema.Types.Mixed,
  },
});

module.exports = mongoose.model('WaitingList', WaitingListSchema);
