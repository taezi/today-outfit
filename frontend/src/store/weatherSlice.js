import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getTodayWeatherApi } from "../api/weatherApi.js";

const initialState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchTodayWeather = createAsyncThunk("weather/fetchToday", async () => {
  return getTodayWeatherApi();
});

const weatherSlice = createSlice({
  name: "weather",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTodayWeather.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTodayWeather.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchTodayWeather.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default weatherSlice.reducer;
