const moment = require('moment');

module.exports = function timestamp(schema) {
  // Add the two fields to the schema
  schema.add({
    createdAt: String,
    updatedAt: String,
  });

  // Create a pre-save hook
  schema.pre('save', function (next) {
    let now = moment().format();

    this.updatedAt = now;
    // Set a value for createdAt only if it is null
    if (!this.createdAt) {
      this.createdAt = now;
    }
    // Call the next function in the pre-save chain
    next();
  });
};
