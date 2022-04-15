const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const { PRODUCTION } = require('./constants');
const config = require('./config');
const helmet = require('helmet');
const { dbUri } = require('./database');
const Logger = require('./core/Logger');

const {
  errorHandler,
  pageNotFound,
  logVisited,
} = require('./middlewares/error.handler');

// create the server
const app = express();
const log = new Logger();

/* MIDDLEWARES */
app.use(cors());
app.use(helmet());

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'static')));

if (config.app.env !== PRODUCTION) app.use(logVisited);

const stream = {
  write: log.info.bind(log),
};

app.use(
  morgan(config.app.env === 'local' ? 'dev' : 'combined', { stream })
);
app.use(logVisited);

/* ROUTES */
app.use('/v1', require('./http/routes'));
app.use('/healthz', (req, res) => res.send('Ok'));

/* EXCEPTION HANDLERS */
app.use(errorHandler);
app.use(pageNotFound);

module.exports = app;
