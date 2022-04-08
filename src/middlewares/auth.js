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
  authentication: (tokenFlag = 'AUTH') => {
    return async (req, res, next) => {
      try {
        const authorization = req.header('authorization') || '';
        const token = authorization.split(' ')[1];
        if (!token) {
          return next(
            new AuthenticationError(
              'you need to be authenticated to access this endpoint'
            )
          );
        }

        const { accountId, flag, counter } = await utils.decodeToken(token);

        if (!accountId) {
          return next(new AuthenticationError('unable to verify token'));
        }

        if (flag !== tokenFlag) {
          return next(
            new AuthenticationError(`token is not valid for ${tokenFlag}`)
          );
        }

        const account = await accountRepo.getaccountById(accountId);

        if (!account || tokenFlag === 'AUTH') {
          return next(new AuthenticationError('token is invalid'));
        }

        req.session = { account };

        return next();
      } catch (e) {
        switch (e.name) {
          case 'TokenExpiredError':
            return next(new AuthenticationError('token has expired'));
          case 'JsonWebTokenError':
            return next(new AuthenticationError(e.message));
          case 'NotBeforeError':
            return next(new AuthenticationError(e.message));
          default:
            return next(e);
        }
      }
    };
  },
};
