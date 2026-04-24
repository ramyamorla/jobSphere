import { API_BASE_URL } from "../../../config/apiConfig";

export async function createJobApi(payload) {
  const response = await fetch(`${API_BASE_URL}/jobs`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || "Failed to create job");
  }

  return response.json();
}

export async function getJobsApi() {
  const response = await fetch(`${API_BASE_URL}/jobs`);

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || "Failed to fetch jobs");
  }

  return response.json();
}

export async function deleteJobApi(jobId) {
  const response = await fetch(`${API_BASE_URL}/jobs/${jobId}`, {
    method: "DELETE"
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(errorBody || "Failed to delete job");
  }
}
