import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    appliedCoupon: null, // { code, discountAmount, newTotal }
    isLoading: false,
    error: null,
};

export const applyCoupon = createAsyncThunk('coupon/applyCoupon', async ({ code, cartTotal }, { rejectWithValue }) => {

    try {
        const response = await axios.post(`http://localhost:5000/api/shop/coupon/apply`, {
            code,
            cartTotal
        });

        return response.data;
    } catch (error) {
        return rejectWithValue(error.response?.data?.message || "Failed to apply coupon");
    }

});

const couponSlice = createSlice({
    name: "coupon",
    initialState,
    reducers: {
        clearCoupon: (state) => {
            state.appliedCoupon = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(applyCoupon.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(applyCoupon.fulfilled, (state, action) => {
                state.isLoading = false;
                if (action.payload.success) {
                    state.appliedCoupon = action.payload.data;
                }
            })
            .addCase(applyCoupon.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload || action.error.message;
            })
    }
});

export const { clearCoupon } = couponSlice.actions;
export default couponSlice.reducer;
