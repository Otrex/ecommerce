const express = require('express');
const LogisticsController = require('../controllers/logistics');
const {
  authentication,
  authorization,
} = require('../../middlewares/auth');
const { ACCOUNT_TYPES } = require('../../constants');
const router = express.Router();

router.use(authentication());

router
  .route('/vendor/logistics')
  .get(
    authorization([ACCOUNT_TYPES.BUSINESS]),
    LogisticsController.getCompanies
  );

router
  .route('/admin/logistics/new')
  .post(
    authorization([ACCOUNT_TYPES.ADMIN]),
    LogisticsController.addCompany
  );

router
  .route('/vendor/logistics/set-default')
  .patch(
    authorization([ACCOUNT_TYPES.BUSINESS]),
    LogisticsController.setDefault
  );

module.exports = router;
