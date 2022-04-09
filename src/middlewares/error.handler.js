const { AppEnvironmentEnum } = require('../config');
const config = require('../config');
const {
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  ServiceError,
  NotFoundError,
} = require('../http/lib/exceptions');
const Logger = require('../core/Logger');

const log = new Logger();

const errorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    return next(err);
  }

  switch (err.name) {
    case ServiceError.name:
    case NotFoundError.name:
    case AuthenticationError.name:
    case AuthorizationError.name:
      return res.status(err.statusCode).send({
        status: 'error',
        message: err.message,
      });
    case ValidationError.name:
      return res.status(err.statusCode || 422).send({
        status: 'error',
        message: err.message,
        errors: err.errors,
      });
    default:
      log.error(err.message, {
        url: req.originalUrl,
        method: req.method,
        body: req.body,
        stack: err.stack,
      });
      return res.status(500).send({
        status: 'error',
        message: 'an error occurred',
        ...(config.app.env === 'development' || config.app.env === 'test'
          ? { stack: err.stack }
          : {}),
      });
  }
};

const pageNotFound = (req, res, next) => {
  res.status(404).send({
    status: 'error',
    message: 'endpoint not found',
  });
};

const logVisited = (req, res, next) => {
  log.setScope('route');
  log.info(req.url);
  next();
};

module.exports = {
  errorHandler,
  pageNotFound,
  logVisited,
};
