const { createLogger, format, transports } = require('winston');
const { consoleFormat } = require('winston-console-format');
const config = require('../config');
const { AppEnvironmentEnum } = require('../config');

const { TEST, LOCAL } = { ...AppEnvironmentEnum };

const consoleTransportOptions = [TEST, LOCAL].includes(config.app.env)
  ? {
      handleExceptions: true,
      format: format.combine(
        format.colorize({ all: true }),
        format.padLevels(),
        consoleFormat({
          showMeta: true,
          metaStrip: ['timestamp'],
          inspectOptions: {
            depth: Infinity,
            colors: true,
            maxArrayLength: Infinity,
            breakLength: 120,
            compact: Infinity,
          },
        })
      ),
    }
  : { handleExceptions: true };

const createComponentLogger = (component) =>
  createLogger({
    level: 'debug',
    format: format.combine(
      format.timestamp(),
      format.errors({ stack: true }),
      format.splat(),
      format.json()
    ),
    defaultMeta: { component },
    transports: [new transports.Console(consoleTransportOptions)],
  });

exports.generalLogger = createComponentLogger('GENERAL');
exports.routesLogger = createComponentLogger('ROUTES');
exports.errorLogger = createComponentLogger('ERROR');
exports.scriptLogger = createComponentLogger('SCRIPT');
