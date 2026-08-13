import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
    couponList: [],
    isLoading: false,
    error: null,
};

export const addNewCoupon = createAsyncThunk('adminCoupon/addNewCoupon', async (formData) => {

    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/admin/coupon/add`, formData);

    return response.data;

});

export const fetchAllCoupons = createAsyncThunk('adminCoupon/fetchAllCoupons', async () => {

    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/admin/coupon/get`);

    return response.data;

});

export const editCoupon = createAsyncThunk('adminCoupon/editCoupon', async ({ id, formData }) => {

    const response = await axios.put(`${import.meta.env.VITE_API_URL}/api/admin/coupon/edit/${id}`, formData);

    return response.data;

});

export const deleteCoupon = createAsyncThunk('adminCoupon/deleteCoupon', async (id) => {

    const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/admin/coupon/delete/${id}`);

    return response.data;

});

const adminCouponSlice = createSlice({
    name: "adminCoupon",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllCoupons.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchAllCoupons.fulfilled, (state, action) => {
                state.isLoading = false;
                state.couponList = action.payload.data;
            })
            .addCase(fetchAllCoupons.rejected, (state, action) => {
                state.isLoading = false;
                state.couponList = [];
                state.error = action.error.message;
            })
    }
});

export default adminCouponSlice.reducer;
