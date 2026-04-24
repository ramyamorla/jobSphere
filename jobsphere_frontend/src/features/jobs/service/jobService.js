import { createJobApi, deleteJobApi, getJobsApi } from "../api/jobApi";

export async function createJob(request) {
  return createJobApi(request);
}

export async function fetchJobs() {
  return getJobsApi();
}

export async function removeJob(jobId) {
  return deleteJobApi(jobId);
}
