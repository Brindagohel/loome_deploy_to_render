require('dotenv').config();

const express = require('express')
const mongoose = require('mongoose');
const  cookieParser = require('cookie-parser');
const cors = require('cors');
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopOrdersRouter = require("./routes/shop/order-routes");
const shopReviewRouter = require("./routes/shop/review-routes");
const adminOrderRouter  = require("./routes/admin/order-routes");
const shopWishlistRouter = require("./routes/shop/wishlist-routes");
const shopCouponRouter = require("./routes/shop/coupon-routes");
const adminCouponRouter = require("./routes/admin/coupon-routes");
const adminDashboardRouter = require("./routes/admin/dashboard-routes");

const commonFeatureRouter = require("./routes/common/features-routes");

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch((error) => console.log(error));

const app = express()
const PORT = process.env.PORT || 5000;

app.use(
    cors({
         origin :process.env.CLIENT_BASE_URL.split(','),
        methods : ['GET' , 'POST', 'DELETE', 'PUT'],
        allowedHeaders : [
            "Content-Type",
            "Authorization",
            'Cache-Control',
            'Expires',
            'Pragma'
        ],
        credentials : true
        
    })
)

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/auth" , authRouter);
app.use("/api/admin/products", adminProductsRouter);
app.use("/api/shop/products" , shopProductsRouter);
app.use("/api/shop/cart", shopCartRouter);
app.use("/api/shop/address", shopAddressRouter);
app.use("/api/shop/order" , shopOrdersRouter);
app.use("/api/shop/search" , shopSearchRouter);
app.use("/api/shop/review" , shopReviewRouter);
app.use("/api/admin/orders", adminOrderRouter);
app.use("/api/shop/wishlist", shopWishlistRouter);
app.use("/api/shop/coupon", shopCouponRouter);
app.use("/api/admin/coupon", adminCouponRouter);
app.use("/api/admin/dashboard", adminDashboardRouter);

app.use("/api/common/feature", commonFeatureRouter);

app.listen(PORT, () => console.log(`server is running on port ${PORT}`));