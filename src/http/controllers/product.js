const RequestHandler = require('.');
const ProductService = require('../services/product.service');
const {
  LikeProductValidator,
  CreateProductValidator,
  ApproveProductValidator,
  GetProductDetailsValidator,
  GetBusinessProductValidator,
  GetFavoriteProductValidator,
  GetProductByCategoryValidator,
} = require('../validators');

class ProductController {
  static createProduct = RequestHandler({
    validator: CreateProductValidator,
    handler: ProductService.createProduct,
  });

  static approveProduct = RequestHandler({
    validator: ApproveProductValidator,
    handler: ProductService.approveProduct,
  });

  static getProduct_Business = RequestHandler({
    validator: GetBusinessProductValidator,
    handler: ProductService.getProducts_Business,
  });

  static getProductsByCategory = RequestHandler({
    validator: GetProductByCategoryValidator,
    handler: ProductService.getProductByCategory,
  });

  static getFavorites = RequestHandler({
    validator: GetFavoriteProductValidator,
    handler: ProductService.getFavorites,
  });

  static likeProduct = RequestHandler({
    validator: LikeProductValidator,
    handler: ProductService.likeProduct,
  });

  static getProductDetails =  RequestHandler({
    validator: GetProductDetailsValidator,
    handler: ProductService.getProductDetails,
  });
}

module.exports = ProductController;
