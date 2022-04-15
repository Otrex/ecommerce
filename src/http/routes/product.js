const express = require('express');
const ProductController = require('../controllers/product');
const {
  authentication,
  authorization,
} = require('../../middlewares/auth');
const { ACCOUNT_TYPES } = require('../../constants');
const router = express.Router();

router.use(authentication());

router
  .route('/')
  .get(
    authorization([ACCOUNT_TYPES.BUSINESS]),
    ProductController.getProduct_Business
  )
  .post(
    authorization([ACCOUNT_TYPES.BUSINESS]),
    ProductController.createProduct
  );

module.exports = router;
