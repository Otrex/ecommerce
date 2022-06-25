const Router = require('../../../core/Router');
const LogisticsController = require('../../controllers/logistics');

class LogisticsRouter extends Router {
  $baseRoute = '/logistics';

  register() {
    this.$router.use(this.$middleware.authentication());
    this.$router
      .route('/')
      .get(
        this.$middleware.authorization([
          this.CONSTANTS.ACCOUNT_TYPES.BUSINESS,
        ]),
        LogisticsController.getCategories
      )
      .post(
        this.$middleware.authorization([
          this.CONSTANTS.ACCOUNT_TYPES.ADMIN,
        ]),
        LogisticsController.addCompany
      );

    this.$router
      .route('/:companyId/set-default')
      .patch(
        this.$middleware.authorization([
          this.CONSTANTS.ACCOUNT_TYPES.BUSINESS,
        ]),
        LogisticsController.setDefault
      );

    return this;
  }
}

module.exports = new LogisticsRouter();
