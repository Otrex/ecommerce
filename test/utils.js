const ObjectId = require("mongoose").Types.ObjectId;
const models = require("../src/http/models")

exports.getToken = async ({ accountId }, type = "register") => {
  return models.TimedToken.findOne({ accountId: ObjectId(accountId), type });
}