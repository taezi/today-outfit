import { request } from "./apiClient.js";

export function loginApi({ email, password }) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function signupApi(signupData) {
  return request("/api/auth/signup", {
    method: "POST",
    body: JSON.stringify(signupData),
  });
}
