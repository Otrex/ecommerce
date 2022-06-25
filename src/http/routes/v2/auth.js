const Router = require('../../../core/Router');
const AuthController = require('../../controllers/auth');

class AuthRouter extends Router {
  $baseRoute = '/auth';

  register() {
    this.$router.post('/login', AuthController.login);
    this.$router.post(
      '/customer/register',
      AuthController.registerCustomer
    );
    this.$router.post(
      '/vendor/register',
      AuthController.registerBusiness
    );
    return this;
  }
}

module.exports = new AuthRouter();
