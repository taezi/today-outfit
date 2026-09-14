const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080";
const normalizedApiBaseUrl = API_BASE_URL.replace(/\/$/, "");

export async function request(path, options = {}) {
  const response = await fetch(`${normalizedApiBaseUrl}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  const contentType = response.headers.get("content-type");
  const hasJsonBody = contentType?.includes("application/json");
  const data = hasJsonBody ? await response.json() : null;

  if (!response.ok) {
    throw new Error(data?.message || "API 요청에 실패했습니다.");
  }

  return data;
}
