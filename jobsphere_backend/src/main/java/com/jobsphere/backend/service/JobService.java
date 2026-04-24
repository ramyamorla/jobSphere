package com.jobsphere.backend.service;

import com.jobsphere.backend.dto.job.CreateJobRequest;
import com.jobsphere.backend.dto.job.JobResponse;
import java.util.List;

public interface JobService {
    JobResponse createJob(CreateJobRequest request);

    List<JobResponse> getAllJobs();

    List<JobResponse> searchJobs(String keyword, String location, String jobType, String workMode, Integer minSalary);

    void deleteJobById(String jobId);
}
