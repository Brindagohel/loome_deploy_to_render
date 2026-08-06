const express = require('express');

const { applyCoupon } = require('../../controllers/shop/coupon-controller');

const router = express.Router();

router.post('/apply', applyCoupon);

module.exports = router;
