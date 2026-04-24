import { API_BASE_URL } from "../../../config/apiConfig";

export async function fetchRecruiterProfileById(profileId) {
  const response = await fetch(`${API_BASE_URL}/recruiters/${encodeURIComponent(profileId)}`);
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || "Failed to load recruiter profile");
  }
  return response.json();
}
