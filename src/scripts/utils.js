const crypto = require('crypto');
const config = require('../config');
const {
  APP_ENV,
  TOKEN_FLAG,
  ACCOUNT_TYPES,
} = require('../constants');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');
const { chain } = require('lodash')

const models = require('../http/models');

const generateToken = (length) => {
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

const generateNumbers = (length) => {
  return config.app.env !== APP_ENV.PRODUCTION
    ? 12345
    : Math.floor(Math.random() * (Math.pow(10, length) - 1));
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
    counter: generateToken(36),
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
};

exports.filterDates = (dateArray = [], key = "day", startOf = "week") => {
  const occurrenceDay = (occurrence) => {
    return moment(occurrence.createdAt).startOf(startOf).format();
  };

  const groupToDay = (group, day) => ({ [key] : day, group });
  return chain(dateArray)
    .groupBy(occurrenceDay)
    .map(groupToDay)
    .orderBy(key, "desc")
    .value();
};

exports.calcSkip = ({ page, limit }) => {
  return (page - 1) * limit;
};

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
};

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
};

exports.distanceBtwPoints = (lat1, lat2, lon1, lon2) => {
  lon1 = (lon1 * Math.PI) / 180;
  lon2 = (lon2 * Math.PI) / 180;
  lat1 = (lat1 * Math.PI) / 180;
  lat2 = (lat2 * Math.PI) / 180;

  // Haversine formula
  let dlon = lon2 - lon1;
  let dlat = lat2 - lat1;
  let a =
    Math.pow(Math.sin(dlat / 2), 2) +
    Math.cos(lat1) * Math.cos(lat2) * Math.pow(Math.sin(dlon / 2), 2);

  let c = 2 * Math.asin(Math.sqrt(a));

  // Radius of earth in kilometers. Use 3956
  // for miles
  let r = 6371;

  // calculate the result
  return c * r;
};

exports.generateNumbers = generateNumbers;
exports.generateToken = generateToken;
