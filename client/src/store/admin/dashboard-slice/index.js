import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "../../../config/api";

const initialState = {
    stats: null,
    isLoading: false,
    error: null,
};

export const fetchDashboardStats = createAsyncThunk('adminDashboard/fetchDashboardStats', async () => {

    const response = await axios.get(`${API_URL}/api/admin/dashboard/stats`);

    return response.data;

});

const dashboardSlice = createSlice({
    name: "adminDashboard",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardStats.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.isLoading = false;
                state.stats = action.payload.data;
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.error.message;
            })
    }
});

export default dashboardSlice.reducer;
