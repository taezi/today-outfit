import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginApi, signupApi } from "../api/authApi.js";

const savedUser = localStorage.getItem("todayOutfitUser");

const initialState = {
  user: savedUser ? JSON.parse(savedUser) : null,
  isLoggedIn: Boolean(savedUser),
  loading: false,
  error: null,
};

export const login = createAsyncThunk("auth/login", async (loginData) => {
  return loginApi(loginData);
});

export const signup = createAsyncThunk("auth/signup", async (signupData) => {
  return signupApi(signupData);
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.isLoggedIn = false;
      state.error = null;
      localStorage.removeItem("todayOutfitUser");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isLoggedIn = true;
        localStorage.setItem("todayOutfitUser", JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(signup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signup.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(signup.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
