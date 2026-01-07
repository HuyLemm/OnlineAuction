import { REFRESH_TOKEN_API } from "./api";

export interface RefreshTokenResponse {
  accessToken: string;
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  const isFormData = options.body instanceof FormData;

  let res = await fetch(url, {
    ...options,
    headers: {
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      Authorization: `Bearer ${accessToken}`,
      ...(options.headers || {}),
    },
  });

  if (res.status === 401 && refreshToken) {
    const refreshRes = await fetch(REFRESH_TOKEN_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!refreshRes.ok) {
      throw new Error("Session expired");
    }

    const data = await refreshRes.json();
    localStorage.setItem("accessToken", data.accessToken);

    res = await fetch(url, {
      ...options,
      headers: {
        ...(isFormData ? {} : { "Content-Type": "application/json" }),
        Authorization: `Bearer ${data.accessToken}`,
        ...(options.headers || {}),
      },
    });
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || "Request failed");
  }

  return res;
}
