const express = require('express');
const router = express.Router();

router.use('/public', require('./public'));
router.use('/info', require('./info'));
router.use('/auth', require('./auth'));

router.use(require('./auth'));
router.use(require('./user'));


router.use(require('./product'));
router.use(require('./order'));
router.use(require('./cart'));

module.exports = router;
