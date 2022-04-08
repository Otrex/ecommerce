const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));

router.use('/dropoff', require('./dropoff'));

router.use('/info', require('./info'));

// router.use('/items', require('./items'));

module.exports = router;
