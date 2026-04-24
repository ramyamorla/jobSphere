import { createJobApi, getJobsApi } from "../api/jobApi";

export async function createJob(request) {
  return createJobApi(request);
}

export async function fetchJobs() {
  return getJobsApi();
}
