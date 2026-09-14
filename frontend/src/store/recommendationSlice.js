import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  createRecommendationApi,
  deleteRecommendationApi,
  getRecommendationPromptApi,
  getRecommendationsApi,
} from "../api/recommendationApi.js";

const initialState = {
  current: null,
  histories: [],
  prompt: null,
  loading: false,
  error: null,
};

export const createRecommendation = createAsyncThunk(
  "recommendation/create",
  async (userId) => createRecommendationApi(userId)
);

export const fetchRecommendations = createAsyncThunk(
  "recommendation/fetchHistories",
  async (userId) => getRecommendationsApi(userId)
);

export const fetchRecommendationPrompt = createAsyncThunk(
  "recommendation/fetchPrompt",
  async (userId) => getRecommendationPromptApi(userId)
);

export const deleteRecommendation = createAsyncThunk(
  "recommendation/delete",
  async (recommendationId) => {
    await deleteRecommendationApi(recommendationId);
    return recommendationId;
  }
);

const recommendationSlice = createSlice({
  name: "recommendation",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createRecommendation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRecommendation.fulfilled, (state, action) => {
        state.loading = false;
        state.current = action.payload;
        state.histories = [action.payload, ...state.histories];
      })
      .addCase(createRecommendation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchRecommendations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendations.fulfilled, (state, action) => {
        state.loading = false;
        state.histories = action.payload;
      })
      .addCase(fetchRecommendations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchRecommendationPrompt.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecommendationPrompt.fulfilled, (state, action) => {
        state.loading = false;
        state.prompt = action.payload.prompt;
      })
      .addCase(fetchRecommendationPrompt.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(deleteRecommendation.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRecommendation.fulfilled, (state, action) => {
        state.loading = false;
        state.histories = state.histories.filter(
          (history) => history.id !== action.payload
        );
        if (state.current?.id === action.payload) {
          state.current = null;
        }
      })
      .addCase(deleteRecommendation.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export default recommendationSlice.reducer;
