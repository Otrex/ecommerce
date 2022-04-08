const { AuthenticationError } = require('../http/lib/exceptions');
const models = require('../http/models');

module.exports = {
  deSerialize: async (req, res, next) => {
    try {
      const { sessionID } = req;
      const account = await models.Account.findOne({ sessionID });
      if (!account) {
        return next(
          new AuthenticationError('session does not exist or has expired')
        );
      }
      req.session.account = account;
      console.log(req.session);
      next();
    } catch (err) {
      return next(err);
    }
  },
};
