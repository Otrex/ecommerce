const RequestHandler = require('.');
const ProductService = require('../services/product.service');
const { 
  CreateProductValidator, 
  GetBusinessProductValidator 
} = require('../validators');

class ProductController {
  static createProduct = RequestHandler({
    validator: CreateProductValidator,
    handler: ProductService.createProduct,
  });

  static getProduct_Business = RequestHandler({
    validator: GetBusinessProductValidator,
    handler: ProductService.getProducts_Business,
  });
}

module.exports = ProductController;
