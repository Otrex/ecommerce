const express = require('express');
const CartController = require('../controllers/cart');
const {
  authentication,
  authorization,
} = require('../../middlewares/auth');
const { ACCOUNT_TYPES } = require('../../constants');
const router = express.Router();

router.use(authentication());

router
  .route('/buyer/cart')
  .get(
    authorization([ACCOUNT_TYPES.CUSTOMER]),
    CartController.getCart
  )
  .put(
    authorization([ACCOUNT_TYPES.CUSTOMER]),
    CartController.addToCart
  );

module.exports = router;