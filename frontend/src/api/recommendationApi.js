import { request } from "./apiClient.js";

export function createRecommendationApi(userId) {
  return request(`/api/recommendations/users/${userId}`, {
    method: "POST",
  });
}

export function getRecommendationsApi(userId) {
  return request(`/api/recommendations/users/${userId}`);
}

export function getRecommendationPromptApi(userId) {
  return request(`/api/recommendations/users/${userId}/prompt`);
}

export function deleteRecommendationApi(recommendationId) {
  return request(`/api/recommendations/${recommendationId}`, {
    method: "DELETE",
  });
}
