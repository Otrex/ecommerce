const express = require('express');
const router = express.Router();

router.use(require('./auth'));
router.use(require('./public'));
router.use(require('./product'));
router.use(require('./order'));
router.use(require('./info'));
router.use(require('./cart'));

module.exports = router;
