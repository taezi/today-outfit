import { request } from "./apiClient.js";

export function getTodayWeatherApi() {
  return request("/api/weather/today");
}
