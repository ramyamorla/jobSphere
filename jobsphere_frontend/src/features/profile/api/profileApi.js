import { API_BASE_URL } from "../../../config/apiConfig";

async function parseOrThrow(response, fallback) {
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || fallback);
  }
  return response.json();
}

export async function fetchStudentProfile(profileId) {
  const response = await fetch(`${API_BASE_URL}/profiles/student/${encodeURIComponent(profileId)}`);
  return parseOrThrow(response, "Failed to fetch student profile");
}

export async function updateStudentProfile(profileId, payload) {
  const response = await fetch(`${API_BASE_URL}/profiles/student/${encodeURIComponent(profileId)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return parseOrThrow(response, "Failed to update student profile");
}

export async function uploadStudentResume(profileId, file) {
  const data = new FormData();
  data.append("file", file);
  const response = await fetch(`${API_BASE_URL}/profiles/student/${encodeURIComponent(profileId)}/resume`, {
    method: "POST",
    body: data
  });
  return parseOrThrow(response, "Failed to upload resume");
}

export async function fetchRecruiterProfile(profileId) {
  const response = await fetch(`${API_BASE_URL}/profiles/recruiter/${encodeURIComponent(profileId)}`);
  return parseOrThrow(response, "Failed to fetch recruiter profile");
}

export async function updateRecruiterProfile(profileId, payload) {
  const response = await fetch(`${API_BASE_URL}/profiles/recruiter/${encodeURIComponent(profileId)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return parseOrThrow(response, "Failed to update recruiter profile");
}
