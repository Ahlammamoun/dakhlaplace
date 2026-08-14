const API_BASE_URL = "/api";

async function apiRequest(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      Accept: "application/json",
      ...options.headers,
    },
  });

  const contentType =
    response.headers.get("content-type") ?? "";

  const data = contentType.includes("application/json")
    ? await response.json()
    : null;

  if (!response.ok) {
    const error = new Error(
      data?.message ?? `Erreur HTTP ${response.status}`
    );

    error.status = response.status;
    error.data = data;

    throw error;
  }

  return data;
}

export function loginAdmin(email, password) {
  return apiRequest("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });
}

export function getCurrentUser() {
  return apiRequest("/me");
}

export function logoutAdmin() {
  return apiRequest("/logout", {
    method: "POST",
  });
}

export function getAdminContents() {
  return apiRequest("/admin/content");
}

export function createAdminContent(payload) {
  return apiRequest("/admin/content", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export function updateAdminContent(id, payload) {
  return apiRequest(`/admin/content/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export function deleteAdminContent(id) {
  return apiRequest(`/admin/content/${id}`, {
    method: "DELETE",
  });
}

export function uploadContentImage(
  contentId,
  file,
  imageData = {}
) {
  const formData = new FormData();

  formData.append("image", file);
  formData.append("altText", imageData.altText ?? "");
  formData.append("caption", imageData.caption ?? "");
  formData.append(
    "isMain",
    imageData.isMain ? "true" : "false"
  );
  formData.append(
    "position",
    String(imageData.position ?? 0)
  );

  return apiRequest(
    `/admin/content/${contentId}/images`,
    {
      method: "POST",
      body: formData,
    }
  );
}

export function deleteContentImage(
  contentId,
  imageId
) {
  return apiRequest(
    `/admin/content/${contentId}/images/${imageId}`,
    {
      method: "DELETE",
    }
  );
}

export function getPublicContents(filters = {}) {
  const searchParams = new URLSearchParams();

  if (filters.type) {
    searchParams.set("type", filters.type);
  }

  if (filters.featured !== undefined) {
    searchParams.set(
      "featured",
      filters.featured ? "true" : "false"
    );
  }

  const query = searchParams.toString();

  return apiRequest(
    `/content${query ? `?${query}` : ""}`
  );
}

export function getPublicContent(slug) {
  return apiRequest(`/content/${slug}`);
}

export function getAdminContent(id) {
  return apiRequest(`/admin/content/${id}`);
}

export function subscribeNewsletter(email) {
  return apiRequest("/newsletter/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });
}

export function getAdminNewsletterSubscribers() {
  return apiRequest("/admin/newsletter");
}

export function toggleNewsletterSubscriber(id) {
  return apiRequest(
    `/admin/newsletter/${id}/toggle`,
    {
      method: "PATCH",
    }
  );
}

export function sendContactMessage(payload) {
  return apiRequest("/contact", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export function getAdminContactMessages() {
  return apiRequest("/admin/contact");
}

export function getAdminContactMessage(id) {
  return apiRequest(`/admin/contact/${id}`);
}

export function toggleAdminContactMessageRead(id) {
  return apiRequest(
    `/admin/contact/${id}/toggle-read`,
    {
      method: "PATCH",
    }
  );
}
export function getSocialNetworks() {
  return apiRequest("/social-networks");
}

export function getAdminSocialNetworks() {
  return apiRequest("/admin/social-networks");
}

export function createAdminSocialNetwork(payload) {
  return apiRequest("/admin/social-networks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
}

export function updateAdminSocialNetwork(
  id,
  payload
) {
  return apiRequest(
    `/admin/social-networks/${id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }
  );
}

export function deleteAdminSocialNetwork(id) {
  return apiRequest(
    `/admin/social-networks/${id}`,
    {
      method: "DELETE",
    }
  );
}

export function getPublicImageUrl(path) {
  if (!path) {
    return "";
  }

  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("/")
  ) {
    return path;
  }

  return `/uploads/content/${path}`;
}