const express = require('express');
const InfoController = require('../controllers/info');
const { authentication } = require('../../middlewares/auth');
const router = express.Router();

router.use(authentication);
router.get('/categories', InfoController.getCategories);
router.get('/weights', InfoController.getWeights);

module.exports = router;
