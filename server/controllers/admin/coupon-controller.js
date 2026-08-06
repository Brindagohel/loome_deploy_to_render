const Coupon = require("../../models/Coupon");

const addCoupon = async (req, res) => {
    try {
        const {
            code,
            discountType,
            discountValue,
            minOrderAmount,
            maxDiscountAmount,
            expiryDate,
            usageLimit
        } = req.body;

        if (!code || !discountType || !discountValue || !expiryDate) {
            return res.status(400).json({
                success: false,
                message: "Code, discount type, discount value and expiry date are required"
            });
        }

        const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
        if (existingCoupon) {
            return res.status(400).json({
                success: false,
                message: "A coupon with this code already exists"
            });
        }

        const newCoupon = new Coupon({
            code,
            discountType,
            discountValue,
            minOrderAmount: minOrderAmount || 0,
            maxDiscountAmount: maxDiscountAmount || null,
            expiryDate,
            usageLimit: usageLimit || null
        });

        await newCoupon.save();

        res.status(201).json({
            success: true,
            message: "Coupon created successfully",
            data: newCoupon
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some Error Occured!"
        });
    }
};

const fetchAllCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({}).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: coupons
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some Error Occured!"
        });
    }
};

const editCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;

        const coupon = await Coupon.findByIdAndUpdate(id, updateData, { new: true });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Coupon updated successfully",
            data: coupon
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some Error Occured!"
        });
    }
};

const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;

        const coupon = await Coupon.findByIdAndDelete(id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Coupon deleted successfully"
        });
    } catch (e) {
        console.log(e);
        res.status(500).json({
            success: false,
            message: "Some Error Occured!"
        });
    }
};

module.exports = { addCoupon, fetchAllCoupons, editCoupon, deleteCoupon };
