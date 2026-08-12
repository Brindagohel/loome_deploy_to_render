import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../../config/api";

const initialState = {
  isLoading: false,
  featureImageList: [],
};

export const getFeatureImages = createAsyncThunk(
  '/order/getFeatureImages',
  async () => {
    const response = await axios.get(`${API_URL}/api/common/feature/get`);
    return response.data;
  }
);

export const addFeatureImages = createAsyncThunk(
  '/order/addFeatureImages',
  async (image) => {
    const response = await axios.post(`${API_URL}/api/common/feature/add`, {
      image
    });
    return response.data;
  }
);

export const deleteFeatureImage = createAsyncThunk(
  '/order/deleteFeatureImage',
  async (id) => {
    const response = await axios.delete(`${API_URL}/api/common/feature/delete/${id}`);
    return response.data;
  }
);

const commonSlice = createSlice({
  name: 'commonSlice',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeatureImages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getFeatureImages.fulfilled, (state, action) => {
        state.isLoading = false;
        state.featureImageList = action.payload.data;
      })
      .addCase(getFeatureImages.rejected, (state, action) => {
        state.isLoading = false;
        state.featureImageList = [];
        console.log(action.error);
      });
  },
});

export default commonSlice.reducer;