const express = require('express');
const router = express.Router();

router.use(require('./auth'))
router.use(require('./product'))
router.use(require('./info'));

module.exports = router;
