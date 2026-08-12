import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { API_URL } from "../../../config/api";

const initialState = {
    isLoading: false,
    productList: [],
}

export const addNewProduct = createAsyncThunk(
    "/products/addNewProduct",
    async (formData) => {
        const result = await axios.post(`${API_URL}/api/admin/products/add`, formData,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            });
        return result.data;
    })

export const fetchAllProducts = createAsyncThunk(
    "/products/fetchAllProducts",
    async () => {
        const result = await axios.get(`${API_URL}/api/admin/products/get`);
        return result.data;
    })

export const editProduct = createAsyncThunk(
    "/products/editProduct",
    async ({ id, formData }) => {
        const result = await axios.put(
            `${API_URL}/api/admin/products/edit/${id}`,
            formData,
            { headers: { "Content-Type": "application/json" } }
        );
        return result.data;
    }
);

export const deleteProduct = createAsyncThunk(
    "/products/deleteProduct",
    async (id) => {   // ✅ accepts id directly, no destructuring
        const result = await axios.delete(`${API_URL}/api/admin/products/delete/${id}`);
        return result.data;
    });

const AdminProductsSlice = createSlice({
    name: 'adminProducts',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchAllProducts.pending, (state) => {
            state.isLoading = true;
        }).addCase(fetchAllProducts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.productList = action.payload.data;
        }).addCase(fetchAllProducts.rejected, (state) => {
            state.isLoading = false;
            state.productList = [];
        })
    },
});

export default AdminProductsSlice.reducer;