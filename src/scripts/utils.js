const crypto = require("crypto");
const config = require("../config");
const bcrypt = require("bcrypt");

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
    .substr(0, length);;
};

exports.generateNumbers = (length) => {
  return Math.floor(Math.random() * (Math.pow(10, length) - 1))
}

exports.generateHash = (seed) => {
  const data = seed.toString() + Date.now().toString();
  return crypto.createHash('sha256').update(data).digest('hex');
}

exports.bcryptHash = (password) => {
  return bcrypt.hash(password, config.app.bcryptRounds);
}

exports.bcryptCompare = (password, hash) => {
  return bcrypt.compare(password, hash);
}