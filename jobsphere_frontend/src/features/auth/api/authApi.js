import { API_BASE_URL } from "../../../config/apiConfig";

export async function checkUsernameApi(payload) {
  const response = await fetch(`${API_BASE_URL}/auth/check-username`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || "Failed to check username");
  }

  return response.json();
}

export async function signInApi(payload) {
  const response = await fetch(`${API_BASE_URL}/auth/sign-in`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || "Sign in failed");
  }

  return response.json();
}
