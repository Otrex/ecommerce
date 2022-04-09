const {
  AuthenticationError,
  AuthorizationError,
} = require('../http/lib/exceptions');
const { ObjectId } = require('../http/types');
const models = require('../http/models');
const { ACCOUNT_TYPES } = require('../constants');

module.exports = {
  authorization: (userTypes = [ACCOUNT_TYPES.CUSTOMER]) => {
    return (req, res, next) => {
      const { account } = req.session;
      if (!userTypes.includes(account.type)) {
        return next(
          new AuthorizationError('user not authorized to access this route')
        );
      }
      next();
    };
  },
  isAdmin: (req, res, next) => {
    const { account } = req.session;
    if (!account.isSuperAdmin) {
      return next(
        new AuthorizationError('user not authorized to access this route')
      );
    }
    next();
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

        const account = await models.Account.findOne({
          _id: new ObjectId(accountId),
        });

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
