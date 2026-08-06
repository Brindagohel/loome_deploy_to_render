import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice/index";
import adminProductsSlice from "./admin/products-slice";
import adminOrderSlice from "./admin/order-slice";

import shopProductsSlice from "./shop/products-slice";
import shopCartSlice from "./shop/cart-slice";
import shopAddressSlice from "./shop/address-slice";
import shopOrdersSlice from "./shop/order-slice";
import shopSearchSlice from "./shop/search-slice";
import shopReviewSlice from "./shop/review-slice";
import addressReducer from "./shop/address-slice";
import shopWishlistSlice from "./shop/wishlist-slice";
import shopCouponSlice from "./shop/coupon-slice";
import adminCouponSlice from "./admin/coupon-slice";
import adminDashboardSlice from "./admin/dashboard-slice";

import commonFeatureSlice from "./common-slice";



const store = configureStore({
    reducer : {
        auth : authReducer,
        
        address: addressReducer,
        adminProducts : adminProductsSlice,
        adminOrder : adminOrderSlice,
        shopProducts : shopProductsSlice,
        shopCart : shopCartSlice,
        shopAddress :shopAddressSlice,
        shopSearch : shopSearchSlice,
        shopOrder : shopOrdersSlice,
        shopReview : shopReviewSlice,
        shopWishlist : shopWishlistSlice,
        shopCoupon : shopCouponSlice,
        adminCoupon : adminCouponSlice,
        adminDashboard : adminDashboardSlice,
        commonFeature  : commonFeatureSlice,



    },
})


export default store;