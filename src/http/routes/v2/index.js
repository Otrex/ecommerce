const { Router } = require('express');

const router = Router();
/**
 * ROUTES
 */
const routes = ['./auth', './logistics'];

routes.forEach((route) => {
  router.use(...require(route).getRoutes());
});

module.exports = router;
