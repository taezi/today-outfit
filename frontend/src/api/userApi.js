import { request } from "./apiClient.js";

export function getUserApi(userId) {
  return request(`/api/users/${userId}`);
}

export function updateUserApi(userId, userData) {
  return request(`/api/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });
}
