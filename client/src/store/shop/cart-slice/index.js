import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../../config/api";

const initialState = {
   

    cartItems : { 
        items: [],
    },
    isLoading: false,
    error: null,
};


export const addToCart = createAsyncThunk('cart/addToCart', async({userId, productId, quantity}) => {

    const response = await  axios.post(`${API_URL}/api/shop/cart/add`, {
        userId,
        productId,
        quantity
    });

    return response.data;


});

export const fetchCartItems = createAsyncThunk('cart/fetchCartItems', async({userId}) => {

    const response = await  axios.get(`${API_URL}/api/shop/cart/${userId}`);

    return response.data;


});

export const deleteCartItems = createAsyncThunk('cart/deleteCartItems', async({userId, productId}) => {

    const response = await  axios.delete(`${API_URL}/api/shop/cart/delete/${userId}/${productId}`);

    return response.data;


});

export const updateCartQuantity = createAsyncThunk('cart/updateCartQuantity', async({userId, productId, quantity}) => {

    const response = await  axios.put(`${API_URL}/api/shop/cart/update/${userId}/${productId}`, {
        quantity
    });

    return response.data;


});

const shoppingCartSlice = createSlice({
    name: "shoppingCart",
    initialState,     
    reducers: {},
    extraReducers: (builder) => {

        builder
        .addCase(addToCart.pending, (state) => {
            state.isLoading = true; 
        })
        .addCase(addToCart.fulfilled, (state, action) => {
            state.isLoading = false;
            state.cartItems = action.payload.data; 
        })
        .addCase(addToCart.rejected, (state, action) => {
            state.isLoading = false;
            state.error = action.error.message; 
        })
         .addCase(fetchCartItems.pending, (state) => {
            state.isLoading = true; 
        })
        .addCase(fetchCartItems.fulfilled, (state, action) => {
            state.isLoading = false;
            state.cartItems = action.payload.data; 
        })
        .addCase(fetchCartItems.rejected, (state, action) => {
            state.isLoading = false;
        
            state.error = action.error.message; 
        })
         .addCase(updateCartQuantity.pending, (state) => {
            state.isLoading = true; 
        })
        .addCase(updateCartQuantity.fulfilled, (state, action) => {
            state.isLoading = false;
            state.cartItems = action.payload.data; 
        })
        .addCase(updateCartQuantity.rejected, (state, action) => {
            state.isLoading = false;
           
            state.error = action.error.message; 
        })
         .addCase(deleteCartItems.pending, (state) => {
            state.isLoading = true; 
        })
        .addCase(deleteCartItems.fulfilled, (state, action) => {
            state.isLoading = false;
            state.cartItems = action.payload.data; 
        })
        .addCase(deleteCartItems.rejected, (state, action) => {
            state.isLoading = false;
          
            state.error = action.error.message; 
        })
    }
    
    });

   export  default shoppingCartSlice.reducer;