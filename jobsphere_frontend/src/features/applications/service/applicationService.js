import {
  applyToJobApi,
  getRecruiterApplicationsApi,
  getStudentApplicationsApi,
  updateApplicationStatusApi
} from "../api/applicationApi";

export async function applyToJob(payload) {
  return applyToJobApi(payload);
}

export async function fetchStudentApplications(profileId) {
  return getStudentApplicationsApi(profileId);
}

export async function fetchRecruiterApplications(profileId) {
  return getRecruiterApplicationsApi(profileId);
}

export async function updateApplicationStatus(applicationId, status) {
  return updateApplicationStatusApi(applicationId, status);
}
