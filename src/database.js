const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config(path.join(__dirname, '../.env'));
const config = require('./config');

const Logger = require('./core/Logger');

const log = new Logger('database');
const dbUri =
  process.env.DB_URI.replace('<dbname>', config.db.name) ||
  `mongodb://${config.db.user}:${config.db.password}@${config.db.host}:${config.db.port}/${config.db.name}?authSource=${config.db.authSource}`;

const connect = async () => {
  try {
    const conn = await mongoose.connect(dbUri, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    log.info(`mongodb connected:: @${conn.connection.host}`);
    return conn;
  } catch (err) {
    log.error('mongodb failed to connect', err);
    process.exit(1);
  }
};

class DB {
  connection = undefined;
  async connect() {
    try {
      this.connection = await mongoose.connect(dbUri, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false,
        useUnifiedTopology: true,
      });
      log
        .useColor('cyan')
        .info(
          `mongodb connected:: @${this.connection.connection.host}`
        );
      return this;
    } catch (err) {
      log.error('mongodb failed to connect', err);
      // process.exit(1);
    }
  }

  async disconnect() {
    await mongoose.connection.close();
  }
}

module.exports = { connect, dbUri, DB };
