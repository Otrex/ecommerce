const path = require('path');

const colours = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  underscore: '\x1b[4m',
  blink: '\x1b[5m',
  reverse: '\x1b[7m',
  hidden: '\x1b[8m',

  fg: {
    black: '\x1b[30m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    magenta: '\x1b[35m',
    cyan: '\x1b[36m',
    white: '\x1b[37m',
    crimson: '\x1b[38m', // Scarlet
  },
  bg: {
    black: '\x1b[40m',
    red: '\x1b[41m',
    green: '\x1b[42m',
    yellow: '\x1b[43m',
    blue: '\x1b[44m',
    magenta: '\x1b[45m',
    cyan: '\x1b[46m',
    white: '\x1b[47m',
    crimson: '\x1b[48m',
  },
};
class Logger {
  static _DEFAULT_SCOPE = 'app';

  static parsePathToScope(filepath) {
    if (filepath.indexOf(path.sep) >= 0) {
      filepath = filepath.replace(process.cwd(), '');
      filepath = filepath.replace(`${path.sep}src${path.sep}`, '');
      filepath = filepath.replace(`${path.sep}dist${path.sep}`, '');
      filepath = filepath.replace('.ts', '');
      filepath = filepath.replace('.js', '');
      filepath = filepath.replace(path.sep, ':');
    }
    return filepath;
  }

  #scope = undefined;

  constructor(scope) {
    this.#scope = Logger.parsePathToScope(
      scope ? scope : Logger._DEFAULT_SCOPE
    );
  }

  setScope(scope) {
    this.#scope = Logger.parsePathToScope(
      scope ? scope : Logger._DEFAULT_SCOPE
    );
  }

  useColor(color) {
    this.specifiedColor = colours.fg[color];
    return this;
  }

  debug(message, ...args) {
    this.#log('debug', message, args);
  }

  info(message, ...args) {
    this.#log('info', message, args);
  }

  warn(message, ...args) {
    this.#log('warn', message, args);
  }

  error(message, ...args) {
    this.#log('error', message, args);
  }

  #log(level, message, args) {
    if (message) {
      let output = [
        `${this.#formatScope()} ${message}`,
        args.length ? args : undefined,
        colours.reset,
      ].filter((d) => !!d);

      if (output[0].includes('[app] ')) {
        output = [colours.fg.green, ...output];
      }
      switch (level) {
        case 'error':
          console.error(
            this.specifiedColor || colours.fg.red,
            ...output
          );
          break;

        case 'warn':
          console.warn(
            this.specifiedColor || colours.fg.yellow,
            ...output
          );
          break;

        case 'info':
          console.log(
            this.specifiedColor || colours.fg.blue,
            ...output
          );
          break;

        default:
          console.log(
            this.specifiedColor || colours.reset,
            ...output
          );
          break;
      }
    }
  }

  #formatScope() {
    return `[${this.#scope}]`;
  }
}

module.exports = Logger;
