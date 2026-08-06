import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const initialState = {
    isLoading : false,
    productList : [],
    productDetails : null,
    error : null
}

export const fetchAllFilteredProducts = createAsyncThunk(
    "/products/fetchAllProducts",
    async ({ filterParams, sortParams }) => {

       
        const query = new URLSearchParams();

        for (const [key, value] of Object.entries(filterParams || {})) {
            if (Array.isArray(value) && value.length > 0) {
                query.append(key, value.join(','));
            }
        }
        
        query.append('sortBy', sortParams);

        const result = await axios.get(
            `http://localhost:5000/api/shop/products/get?${query}`,
            { withCredentials: true}
        );
        return result.data;
    }
);
export const fetchProductDetails = createAsyncThunk(
    "/products/fetchProductDetails",
    async (id) => {

        const result = await axios.get(
            `http://localhost:5000/api/shop/products/get/${id}`,
            { withCredentials: true}
        );
        return result.data;
    }
);



const shoppingProductSlice = createSlice({
    name : 'shoppingProducts',
    initialState,
    reducers : {
        setProductDetails : (state)=>{
            state.productDetails = null
        }
    },
    extraReducers : (builder) => {
        builder.addCase(fetchAllFilteredProducts.pending,(state,action)=>{
            state.isLoading = true
        }).addCase(fetchAllFilteredProducts.fulfilled,(state,action)=>{
          
            state.isLoading = false;
            state.productList = action.payload.data;
        }).addCase(fetchAllFilteredProducts.rejected,(state,action)=>{
            console.log(action.error.message);
            
            state.isLoading = false;
            state.productList =[];
            state.error = action.error.message;
        })
        .addCase(fetchProductDetails.pending,(state,action)=>{
            state.isLoading = true
        }).addCase(fetchProductDetails.fulfilled,(state,action)=>{
          
            state.isLoading = false;
            state.productDetails = action.payload.data;
        }).addCase(fetchProductDetails.rejected,(state,action)=>{
            console.log(action.error.message);
            
            state.isLoading = false;
            state.productDetails =null;
            state.error = action.error.message;
        });


    }
})


export const  {setProductDetails} = shoppingProductSlice.actions;

export default shoppingProductSlice.reducer;