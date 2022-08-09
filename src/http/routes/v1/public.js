const express = require('express');
const ProductController = require('../../controllers/product');
const WaitingListController = require('../../controllers/waiting-list.js');
const router = express.Router();

router
  .route('/waiting-list')
  .post(WaitingListController.addToWaitingList);
  
router.route('/products').get(ProductController.getProductsPublic);

router
  .route('/products/:productId')
  .get(ProductController.getProductDetails);

router
  .route('/categories/:categoryId/products')
  .get(ProductController.getProductsByCategory);

module.exports = router;
