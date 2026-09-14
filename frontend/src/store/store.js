import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice.js";
import recommendationReducer from "./recommendationSlice.js";
import weatherReducer from "./weatherSlice.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    weather: weatherReducer,
    recommendation: recommendationReducer,
  },
});
