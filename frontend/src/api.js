const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:3001/api" : "/api");

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.token ? { Authorization: `Bearer ${options.token}` } : {}),
      ...options.headers,
    },
  });

  const result = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(result.error || "Something went wrong. Please try again.");
  }

  return result;
}

export function submitInquiry(inquiry) {
  return request("/inquiries", {
    method: "POST",
    body: JSON.stringify(inquiry),
  });
}

export function signIn(email, password) {
  return request("/admin/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export function getInquiries(token, filters = {}) {
  const query = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      query.set(key, value);
    }
  });

  const suffix = query.size ? `?${query.toString()}` : "";
  return request(`/inquiries${suffix}`, { token });
}

export function updateInquiryStatus(token, id, status) {
  return request(`/inquiries/${id}/status`, {
    method: "PATCH",
    token,
    body: JSON.stringify({ status }),
  });
}
