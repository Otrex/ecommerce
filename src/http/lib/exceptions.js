const AppError = require('../../core/AppError');

class AuthenticationError extends AppError {
  constructor(message) {
    super(message, 401);
  }
}

class AuthorizationError extends AppError {
  constructor(message) {
    super(message, 403);
  }
}

class NotFoundError extends AppError {
  constructor(message) {
    super(message, 404);
  }
}

class ValidationError extends AppError {
  constructor(errors) {
    super(errors, 422);
  }
}

class ServiceError extends AppError {
  constructor(errors) {
    super(errors, 400);
  }
}

class MailError extends AppError {
  constructor(errors) {
    super(errors, 400);
  }
}

class DataBaseError extends AppError {
  constructor(errors, cb) {
    super(errors, 400);
    cb();
  }
}

module.exports = {
  ValidationError,
  AuthenticationError,
  AuthorizationError,
  ServiceError,
  NotFoundError,
  MailError,
};
