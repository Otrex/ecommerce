const express = require('express');
const router = express.Router();

router.use(require('./auth'))
router.use(require('./product'))
router.use(require('./info'));
router.use(require('./cart'));

module.exports = router;
