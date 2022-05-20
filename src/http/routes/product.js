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
  .route('/vendor/products')
  .get(
    authorization([ACCOUNT_TYPES.BUSINESS]),
    ProductController.getProduct_Business
  )
  .post(
    authorization([ACCOUNT_TYPES.BUSINESS]),
    ProductController.createProduct
  );

router
  .route('/admin/products/:productId/approve')
  .post(ProductController.approveProduct);

router
  .route('/buyer/products/favorites')
  .get(ProductController.getFavorites);

router
  .route('/buyer/products/:productId/feedback')
  .post(ProductController.addFeedback);

router
  .route('/buyer/products/:productId/like')
  .post(ProductController.likeProduct);

module.exports = router;
