const express = require('express');
const router = express.Router();

router.use('/auth', require('./auth'));

router.use('/products', require('./product'));

router.use('/info', require('./info'));

module.exports = router;
