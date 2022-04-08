import { Response, NextFunction } from 'express';

import { AuthenticationError } from '../../lib/errors';
import * as utils from '../../utils';
import { AuthenticatedRequest } from '../../controllers';
import UserRepo from '../../database/repositories/UserRepo';
import redis from '../../database/redis';
import AdminRepo from '../../database/repositories/AdminRepo';
import { IUser } from '../../database/models/User';

export default (tokenFlag = 'AUTH', userType: 'user' | 'admin' = 'user') => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
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

      const { userId, flag, counter } = await utils.decodeToken(token);

      if (!userId) {
        return next(new AuthenticationError('unable to verify token'));
      }

      if (flag !== tokenFlag) {
        return next(
          new AuthenticationError(`token is not valid for ${tokenFlag}`)
        );
      }

      const user =
        userType === 'admin'
          ? await AdminRepo.getAdminById(userId)
          : await UserRepo.getUserById(userId);

      const session = await redis.get(
        `sessions:${userId as string}:${counter as string}`
      );

      if (!user || (tokenFlag === 'AUTH' && !session)) {
        return next(new AuthenticationError('token is invalid'));
      }

      req.session = Object.assign(req.session, {
        userId: user.id,
        userType: userType === 'admin' ? userType : (user as IUser).type,
      });

      return next();
    } catch (e: any) {
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
};
