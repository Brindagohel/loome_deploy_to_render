const express = require('express');

const {
    addCoupon,
    fetchAllCoupons,
    editCoupon,
    deleteCoupon
} = require('../../controllers/admin/coupon-controller');

const router = express.Router();

router.post('/add', addCoupon);
router.get('/get', fetchAllCoupons);
router.put('/edit/:id', editCoupon);
router.delete('/delete/:id', deleteCoupon);

module.exports = router;
