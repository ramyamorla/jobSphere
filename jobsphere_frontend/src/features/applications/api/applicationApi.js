import { API_BASE_URL } from "../../../config/apiConfig";

async function parseOrThrow(response, fallback) {
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || fallback);
  }
  return response.json();
}

export async function applyToJobApi(payload) {
  const response = await fetch(`${API_BASE_URL}/applications`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  return parseOrThrow(response, "Failed to apply");
}

export async function getStudentApplicationsApi(profileId) {
  const response = await fetch(`${API_BASE_URL}/applications/student/${encodeURIComponent(profileId)}`);
  return parseOrThrow(response, "Failed to load applications");
}

export async function getRecruiterApplicationsApi(profileId) {
  const response = await fetch(`${API_BASE_URL}/applications/recruiter/${encodeURIComponent(profileId)}`);
  return parseOrThrow(response, "Failed to load applicants");
}

export async function updateApplicationStatusApi(applicationId, status) {
  const response = await fetch(
    `${API_BASE_URL}/applications/${encodeURIComponent(applicationId)}/status?status=${encodeURIComponent(status)}`,
    { method: "PATCH" }
  );
  return parseOrThrow(response, "Failed to update status");
}
