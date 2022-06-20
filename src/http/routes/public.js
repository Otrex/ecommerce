const express = require('express');
const ProductController = require('../controllers/product');
const router = express.Router();

router.route('/products').get(ProductController.getProductsPublic);

router
  .route('/products/:productId')
  .get(ProductController.getProductDetails);

router
  .route('/categories/:categoryId/products')
  .get(ProductController.getProductsByCategory);

module.exports = router;
