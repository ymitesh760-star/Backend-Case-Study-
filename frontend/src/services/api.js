const API_BASE_URL = "http://localhost:5001/api";

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("token");
  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...options, headers });
  } catch {
    throw new ApiError("Cannot connect to the server. Check that the backend is running.", 0);
  }

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    let message = data.message || "Something went wrong. Please try again.";
    if (response.status === 401) message = "Your session has expired. Please log in again.";
    if (response.status >= 500) message = "A server error occurred. Please try again later.";
    if (response.status === 409) message = "An asset with this serial number already exists.";
    if (response.status === 404) message = data.message || "The requested item was not found.";
    throw new ApiError(message, response.status);
  }

  return data;
}

export const authApi = {
  login: (credentials) =>
    apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  register: (user) =>
    apiRequest("/auth/register", {
      method: "POST",
      body: JSON.stringify(user),
    }),
  profile: () => apiRequest("/auth/profile"),
};

export const assetApi = {
  list: () => apiRequest("/assets"),
  get: (id) => apiRequest(`/assets/${id}`),
  create: (asset) =>
    apiRequest("/assets", {
      method: "POST",
      body: JSON.stringify(asset),
    }),
  remove: (id) => apiRequest(`/assets/${id}`, { method: "DELETE" }),
};

export const assignmentApi = {
  list: () => apiRequest("/assignments"),
  create: (assignment) =>
    apiRequest("/assignments", {
      method: "POST",
      body: JSON.stringify(assignment),
    }),
  returnAsset: (id) => apiRequest(`/assignments/${id}/return`, { method: "PUT" }),
};

export function getErrorMessage(error) {
  if (error instanceof ApiError) return error.message;
  return "Something went wrong. Please try again.";
}
