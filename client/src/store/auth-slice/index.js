import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


const initialState = {
    isAuthenticated: false,
    isLoading: true,
    user: null,
    token: null,
};

export const registerUser = createAsyncThunk(
    "auth/register",
    async (formData) => {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/auth/register`,
            formData,
            {
                withCredentials: true,
            }
        );

        return response.data;
    }
);

export const loginUser = createAsyncThunk(
    "auth/login",
    async (formData) => {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/auth/login`,
            formData,
            {
                withCredentials: true,
            }
        );

        return response.data;
    }
);

export const logoutUser = createAsyncThunk(
    "auth/logout",
    async () => {
        const response = await axios.post(
            `${import.meta.env.VITE_API_URL}/api/auth/logout`,
            {},
            {
                withCredentials: true,
            }
        );

        return response.data;
    }
);

// export const checkAuth = createAsyncThunk(
//     "auth/checkauth",
//     async (_, { rejectWithValue }) => {
//         try {
//             const response = await axios.get(
//                 `${import.meta.env.VITE_API_URL}/api/auth/check-auth`,
//                 {
//                     withCredentials: true,
//                     headers: {
//                         "Cache-Control":
//                             "no-store, no-cache, must-revalidate, proxy-revalidate",
//                     },
//                 }
//             );

//             return response.data;
//         } catch (error) {
//             return rejectWithValue(
//                 error.response?.data || {
//                     message: "Auth check failed",
//                 }
//             );
//         }
//     }
// );

export const checkAuth = createAsyncThunk(
    "auth/checkauth",
    async (token, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                `${import.meta.env.VITE_API_URL}/api/auth/check-auth`,
                {
                    
                    headers: {
                        "Cache-Control":
                            "no-store, no-cache, must-revalidate, proxy-revalidate",
                        "Authorization": `Bearer ${token}`
                    },
                }
            );

            return response.data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data || {
                    message: "Auth check failed",
                }
            );
        }
    }
);

const authSlice = createSlice({
    name: "auth",
    initialState,

    reducers: {
        setUser: (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = action.payload !== null;
           
        },
         resetTokenAddCredentials : (state)=>{
                state.isAuthenticated = false;
                state.user = null;
                state.token = null;
                sessionStorage.removeItem('token');
            },
    },

    extraReducers: (builder) => {
        builder
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
            })

            .addCase(registerUser.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })

            .addCase(registerUser.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })

            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
            })

            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.success
                    ? action.payload.user
                    : null;
                state.isAuthenticated = action.payload.success;
                state.token = action.payload.success
                    ? action.payload.token
                    : null;
                sessionStorage.setItem('token' , JSON.stringify(action.payload.token));
            })

            .addCase(loginUser.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
                state.token = null;
            })

            .addCase(checkAuth.pending, (state) => {
                state.isLoading = true;
            })

            .addCase(checkAuth.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.success
                    ? action.payload.user
                    : null;
                state.isAuthenticated = action.payload.success;
            })

            .addCase(checkAuth.rejected, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            })

            .addCase(logoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.isAuthenticated = false;
            });
    },
});

export const { setUser , resetTokenAddCredentials } = authSlice.actions;

export default authSlice.reducer;