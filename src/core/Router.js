const express = require('express');
const middlewares = require('../middlewares/auth');
const { TOKEN_FLAG, ACCOUNT_TYPES } = require('../constants');

class Router {
  $baseRoute = '/';
  $router = express.Router();

  $middleware = Object.freeze(middlewares);
  CONSTANTS = Object.freeze({
    TOKEN_FLAG,
    ACCOUNT_TYPES,
  });

  getRoutes() {
    this.register();
    return [this.$baseRoute, this.$router];
  }

  register() {
    return this;
  }
}

module.exports = Router;
