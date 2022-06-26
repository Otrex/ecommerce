const express = require('express');
const UserController = require('../../controllers/user');
const {
  authentication,
  isAdmin,
} = require('../../../middlewares/auth');
const { TOKEN_FLAG } = require('../../../constants');
const router = express.Router();

router.use(authentication(TOKEN_FLAG.AUTH));

router
  .route('/admin/users/suspend')
  .post(isAdmin, UserController.suspendUser);

router
  .route('/admin/users/unsuspend')
  .post(isAdmin, UserController.unsuspendUser);

router
  .route('/admin/users/businesses/search')
  .get(isAdmin, UserController.searchForBusinesses);

module.exports = router;
