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
