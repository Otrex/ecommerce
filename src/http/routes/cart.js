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
  .delete(
    authorization([ACCOUNT_TYPES.CUSTOMER]),
    CartController.deleteItemFromCart
  )
  .put(
    authorization([ACCOUNT_TYPES.CUSTOMER]),
    CartController.addToCart
  );

router
  .route('/buyer/cart/checkout')
  .get(
    authorization([ACCOUNT_TYPES.CUSTOMER]),
    CartController.getCheckoutDetails
  )
  .post(
    authorization([ACCOUNT_TYPES.CUSTOMER]),
    CartController.checkoutCart
  );

module.exports = router;
