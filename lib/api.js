export async function apiRequest(url, options) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "Something went wrong. Please try again.");
  }

  return data;
}

export function getPosts(search = "") {
  const params = new URLSearchParams();
  if (search) params.set("search", search);

  const query = params.toString();
  return apiRequest(`/api/posts${query ? `?${query}` : ""}`);
}

export function getMyPosts() {
  return apiRequest("/api/posts?mine=true");
}

export function getPost(id) {
  return apiRequest(`/api/posts/${id}`);
}

export function createPost(post) {
  return apiRequest("/api/posts", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });
}

export function updatePost(id, post) {
  return apiRequest(`/api/posts/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  });
}

export function deletePost(id) {
  return apiRequest(`/api/posts/${id}`, { method: "DELETE" });
}

export function getCurrentUser() {
  return apiRequest("/api/auth/me");
}

export function login(credentials) {
  return apiRequest("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });
}

export function signup(details) {
  return apiRequest("/api/auth/signup", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(details),
  });
}

export function logout() {
  return apiRequest("/api/auth/logout", { method: "POST" });
}
