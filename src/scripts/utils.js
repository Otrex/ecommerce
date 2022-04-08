const crypto = require('crypto');
const config = require('../config');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const models = require('../http/models');

exports.generateToken = (length) => {
  return crypto
    .randomBytes(length * 3)
    .toString('base64')
    .split('+')
    .join('')
    .split('/')
    .join('')
    .split('=')
    .join('')
    .substr(0, length);
};

exports.generateNumbers = (length) => {
  return Math.floor(Math.random() * (Math.pow(10, length) - 1));
};

exports.generateHash = (seed) => {
  const data = seed.toString() + Date.now().toString();
  return crypto.createHash('sha256').update(data).digest('hex');
};

exports.bcryptHash = (password) => {
  return bcrypt.hash(password, config.app.bcryptRounds);
};

exports.bcryptCompare = (password, hash) => {
  return bcrypt.compare(password, hash);
};

exports.generateJWTToken = async (
  payload = {},
  secret = config.app.secret,
  expiresIn = '24h'
) => {
  const jwtPayload = {
    ...payload,
    counter: generateRandomCode(36),
  };
  const options = { expiresIn: expiresIn || '720h' };

  return new Promise((resolve, reject) => {
    jwt.sign(jwtPayload, secret, options, (err, token) => {
      if (err) {
        reject(err);
      }
      resolve(token);
    });
  });
};

exports.decodeToken = async (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, config.app.secret, (err, decoded) => {
      if (err) {
        reject(err);
      }
      resolve(decoded);
    });
  });
};

/**
 * This creates the response for a typical pagination endpoint
 * @param data [any[], number]
 * @param page number
 * @param take number usually the `limit`
 */
exports.paginateResponse = (data = [[], 0], page, take) => {
  const [result, total] = data;
  const lastPage = Math.ceil(total / take);
  const nextPage = page + 1 > lastPage ? null : page + 1;
  const prevPage = page - 1 < 1 ? null : page - 1;
  return {
    data: [...result],
    pageData: {
      total,
      currentPage: +page,
      nextPage,
      prevPage,
      lastPage,
    },
  };
}

exports.calcSkip = ({ page, take }) => {
  return (page - 1) * take;
}

/**
 * This creates the response for a typical pagination endpoint
 * @param type eg 'register'
 * @param accountId ObjectId
 * @param nod number [optional] default = 4
 */
exports.generateTimedToken = async (type, accountId, nod = 4) => {
  return models.TimedToken.create({
    expiryTimestamp: moment().add(1, 'hour').toDate().getTime(),
    token: generateNumbers(nod),
    accountId,
    type,
  });
}

/**
 * This creates the response for a typical pagination endpoint
 * @param type eg 'register'
 * @param token string
 * @param accountId ObjectId 
 */
 exports.getTimedToken = async (type, token, accountId) => {
  return models.TimedToken.findOne({
    expiryTimestamp: { $gte: Date.now() },
    accountId,
    type,
    token,
  });
}
