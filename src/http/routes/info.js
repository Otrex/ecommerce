const express = require('express');
const InfoController = require('../controllers/info');
const { deSerialize } = require('../../middlewares/auth');
const router = express.Router();

router.use(deSerialize);
router.get('/categories', InfoController.getCategories);
router.get('/weights', InfoController.getWeights);

module.exports = router;
