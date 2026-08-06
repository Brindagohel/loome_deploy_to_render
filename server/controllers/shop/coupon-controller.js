const Coupon = require("../../models/Coupon");

// Validates a coupon code against the current cart total and returns the
// discount amount to apply. Does NOT mark the coupon as used yet -
// that only happens once the order payment is actually captured
// (see admin/order-controller & shop/order-controller capturePayment).
const applyCoupon = async (req, res) => {
    try {
        const { code, cartTotal } = req.body;

        if (!code || cartTotal === undefined) {
            return res.status(400).json({
                success: false,
                message: "Coupon code and cart total are required"
            });
        }

        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Invalid coupon code"
            });
        }

        if (!coupon.isActive) {
            return res.status(400).json({
                success: false,
                message: "This coupon is no longer active"
            });
        }

        if (new Date(coupon.expiryDate) < new Date()) {
            return res.status(400).json({
                success: false,
                message: "This coupon has expired"
            });
        }

        if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({
                success: false,
                message: "This coupon has reached its usage limit"
            });
        }

        if (cartTotal < coupon.minOrderAmount) {
            return res.status(400).json({
                success: false,
                message: `Minimum order amount of $${coupon.minOrderAmount} required for this coupon`
            });
        }

        let discountAmount = 0;
        if (coupon.discountType === 'flat') {
            discountAmount = coupon.discountValue;
        } else {
            discountAmount = (cartTotal * coupon.discountValue) / 100;
            if (coupon.maxDiscountAmount) {
                discountAmount = Math.min(discountAmount, coupon.maxDiscountAmount);
            }
        }

        // never let the discount exceed the cart total
        discountAmount = Math.min(discountAmount, cartTotal);

        res.status(200).json({
            success: true,
            message: "Coupon applied successfully",
            data: {
                code: coupon.code,
                discountAmount: Number(discountAmount.toFixed(2)),
                newTotal: Number((cartTotal - discountAmount).toFixed(2))
            }
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some Error Occured!"
        });
    }
};

module.exports = { applyCoupon };
