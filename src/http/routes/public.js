const express = require('express');
const ProductController = require('../controllers/product');
const router = express.Router();

router
  .route('/public/categories/:categoryId/products')
  .get(ProductController.getProductsByCategory);

module.exports = router;