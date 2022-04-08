const express = require('express');
const DropOffController = require('../controllers/dropoff');
const { deSerialize } = require('../../middlewares/auth');
const router = express.Router();

router.use(deSerialize);
router.put('/', DropOffController.createDropOff);

module.exports = router;
