const express = require('express');
const OrderController = require('../../controllers/order');
const {
  authentication,
  authorization,
} = require('../../../middlewares/auth');
const { ACCOUNT_TYPES } = require('../../../constants');
const router = express.Router();

router.use(authentication());

router
  .route('/vendor/order/stats')
  .get(
    authorization([ACCOUNT_TYPES.BUSINESS]),
    OrderController.stats
  );
module.exports = router;
