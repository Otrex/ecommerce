const {
  ValidationError,
  ServiceError,
} = require('../../lib/exceptions');
const Validator = require('fastest-validator');
const { MESSAGE } = require('../../../constants');
const  { ObjectID } = require("mongodb") 

class GenericValidator {
  validator = new Validator({
    defaults: {
      objectID: {
        ObjectID
      }
    }
  });
  check(data) {
    // console.log(data, this.schema)
    if (Object.entries(data).length < 1)
      throw new ValidationError('no data passed');
    if (!this.schema) throw new ServiceError('no scheme passed');

    let error = this.validator.compile(this.schema)(data);
    if (error != true) throw new ValidationError(error);

    return data;
  }
}

module.exports = GenericValidator;
