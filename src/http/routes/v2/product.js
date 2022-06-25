const Router = require('../../../core/Router');
const ProductController = require('../../controllers/product');

class ProductRouter extends Router {
  $baseRoute = '/products';

  register() {
    this.$router.get('/search', ProductController.searchForProduct);

    this.$router.use(this.$middleware.authentication());

    this.$router.get('/', (req, res, next) => {
      switch (req.session.type) {
        case this.CONSTANTS.ACCOUNT_TYPES.BUSINESS:
          return ProductController.getProduct_Business(
            req,
            res,
            next
          );
        case this.CONSTANTS.ACCOUNT_TYPES.ADMIN:
          return ProductController.getProducts_Admin(req, res, next);
      }
    });

    this.$router
      .route('/stats')
      .get(
        this.$middleware.authorization([
          this.CONSTANTS.ACCOUNT_TYPES.ADMIN,
        ]),
        ProductController.getCategoryStats
      );
    return this;
  }
}

module.exports = new ProductRouter();
