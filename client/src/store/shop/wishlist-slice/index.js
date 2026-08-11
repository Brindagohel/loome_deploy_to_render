import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    wishlistItems: {
        items: [],
    },
    isLoading: false,
    error: null,
};

export const addToWishlist = createAsyncThunk('wishlist/addToWishlist', async ({ userId, productId }) => {

    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/shop/wishlist/add`, {
        userId,
        productId
    });

    return response.data;

});

export const fetchWishlistItems = createAsyncThunk('wishlist/fetchWishlistItems', async ({ userId }) => {

    const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/shop/wishlist/${userId}`);

    return response.data;

});

export const deleteWishlistItem = createAsyncThunk('wishlist/deleteWishlistItem', async ({ userId, productId }) => {

    const response = await axios.delete(`${import.meta.env.VITE_API_URL}/api/shop/wishlist/delete/${userId}/${productId}`);

    return response.data;

});

const wishlistSlice = createSlice({
    name: "wishlist",
    initialState,
    reducers: {},
    extraReducers: (builder) => {

        builder
            .addCase(addToWishlist.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(addToWishlist.fulfilled, (state, action) => {
                state.isLoading = false;
                state.wishlistItems = action.payload.data;
            })
            .addCase(addToWishlist.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(fetchWishlistItems.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchWishlistItems.fulfilled, (state, action) => {
                state.isLoading = false;
                state.wishlistItems = action.payload.data;
            })
            .addCase(fetchWishlistItems.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
            .addCase(deleteWishlistItem.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(deleteWishlistItem.fulfilled, (state, action) => {
                state.isLoading = false;
                state.wishlistItems = action.payload.data;
            })
            .addCase(deleteWishlistItem.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
    }

});

export default wishlistSlice.reducer;
