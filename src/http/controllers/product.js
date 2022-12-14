const RequestHandler = require('.');
const ProductService = require('../services/product.service');
const {
  GetProductValidator,
  AddFeedbackValidator,
  LikeProductValidator,
  SearchProductValidator,
  GetCategoriesStats,
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

  static disapproveProduct = RequestHandler({
    validator: ApproveProductValidator,
    handler: ProductService.disapproveProduct,
  });

  static getProduct_Business = RequestHandler({
    validator: GetBusinessProductValidator,
    handler: ProductService.getProducts_Business,
  });

  static getProductsByCategory = RequestHandler({
    validator: GetProductByCategoryValidator,
    handler: ProductService.getProductByCategory,
  });

  static getProductsPublic = RequestHandler({
    validator: GetProductValidator,
    handler: ProductService.getApprovedProducts_Public,
  });

  static getFavorites = RequestHandler({
    validator: GetFavoriteProductValidator,
    handler: ProductService.getFavorites,
  });

  static likeProduct = RequestHandler({
    validator: LikeProductValidator,
    handler: ProductService.likeProduct,
  });

  static getProductDetails = RequestHandler({
    validator: GetProductDetailsValidator,
    handler: ProductService.getProductDetails,
  });

  static addFeedback = RequestHandler({
    validator: AddFeedbackValidator,
    handler: ProductService.addFeedback,
  });

  static getCategoryStats = RequestHandler({
    validator: GetCategoriesStats,
    handler: ProductService.getCategoryStats,
  });

  static getProducts_Admin = RequestHandler({
    validator: GetCategoriesStats,
    handler: ProductService.getProductsAdmin,
  });

  static getFeedback_Business = RequestHandler({
    validator: GetProductValidator,
    handler: ProductService.getFeedback,
  });

  static getFeedback_Admin = RequestHandler({
    validator: GetProductValidator,
    handler: ProductService.getFeedback_Admin,
  });

  static searchForProduct = RequestHandler({
    validator: SearchProductValidator,
    handler: ProductService.searchForProduct,
  });

  static getReviewGeneralStats = RequestHandler({
    handler: ProductService.getReviewGeneralStats,
  });

  static grossProductStats = RequestHandler({
    handler: ProductService.grossProductStats,
  });

  static getCategoryStats_Vendor = RequestHandler({
    validator: GetCategoriesStats,
    handler: ProductService.getCategoryStats_Vendor,
  })
}

module.exports = ProductController;
