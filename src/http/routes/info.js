const express = require('express');
const InfoController = require('../controllers/info');
const { authentication, isAdmin } = require('../../middlewares/auth');
const { TOKEN_FLAG } = require('../../constants');
const router = express.Router();

router
  .route('/categories')
  .get(InfoController.getCategories)
  .post(
    authentication(TOKEN_FLAG.AUTH),
    isAdmin,
    InfoController.addCategory
  );

router
  .route('/files/generate-upload-url')
  .get(
    InfoController.generateSignedURL
  );

module.exports = router;
