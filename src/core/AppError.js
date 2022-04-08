class AppError extends Error {
  constructor(message, statusCode, name) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.name = this.constructor.name;
  }
}

module.exports = AppError;
