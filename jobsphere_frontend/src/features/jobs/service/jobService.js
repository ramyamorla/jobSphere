import { createJobApi, deleteJobApi, getJobsApi } from "../api/jobApi";

export async function createJob(request) {
  const skills = request.requiredSkills
    .split(",")
    .map((skill) => skill.trim())
    .filter(Boolean);

  return createJobApi({
    ...request,
    minSalary: Number(request.minSalary),
    maxSalary: Number(request.maxSalary),
    totalPositions: Number(request.totalPositions),
    requiredSkills: skills
  });
}

export async function fetchJobs(filters = {}) {
  return getJobsApi(filters);
}

export async function removeJob(jobId) {
  return deleteJobApi(jobId);
}
