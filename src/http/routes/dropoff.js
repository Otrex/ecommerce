const express = require('express');
const DropOffController = require('../controllers/dropoff');
const { authentication } = require('../../middlewares/auth');
const router = express.Router();

router.use(authentication());
router.put('/', DropOffController.createDropOff);

module.exports = router;
