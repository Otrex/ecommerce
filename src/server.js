const dotenv = require('dotenv');

const path = require('path');

dotenv.config(path.join(__dirname, '../.env'));

const app = require('./app');

const config = require('./config');
const Logger = require('./core/Logger');
const { seedAdmin } = require('./scripts/seeds');

const log = new Logger();

require('./database')
  .connect()
  .then(async () => {
    await seedAdmin();
    app.listen(config.app.port, () => {
      log.info(`SERVER STARTED ::: PORT=${config.app.port}`);
    });
  });
