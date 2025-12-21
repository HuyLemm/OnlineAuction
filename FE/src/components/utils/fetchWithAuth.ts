import { REFRESH_TOKEN_API } from "./api";

export interface RefreshTokenResponse {
  accessToken: string;
}

export async function fetchWithAuth(url: string, options: RequestInit = {}) {
  const accessToken = localStorage.getItem("accessToken");
  const refreshToken = localStorage.getItem("refreshToken");

  let res = await fetch(url, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
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

    const data = (await refreshRes.json()) as RefreshTokenResponse;

    localStorage.setItem("accessToken", data.accessToken);

    res = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${data.accessToken}`,
      },
    });
  }

  return res;
}
