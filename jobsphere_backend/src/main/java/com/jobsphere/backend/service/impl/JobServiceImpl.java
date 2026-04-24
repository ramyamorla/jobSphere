package com.jobsphere.backend.service.impl;

import com.jobsphere.backend.dao.JobDao;
import com.jobsphere.backend.dto.job.CreateJobRequest;
import com.jobsphere.backend.dto.job.JobResponse;
import com.jobsphere.backend.model.Job;
import com.jobsphere.backend.service.JobService;
import java.time.Instant;
import java.util.List;
import org.springframework.stereotype.Service;

@Service
public class JobServiceImpl implements JobService {

    private final JobDao jobDao;

    public JobServiceImpl(JobDao jobDao) {
        this.jobDao = jobDao;
    }

    @Override
    public JobResponse createJob(CreateJobRequest request) {
        Job job = new Job();
        job.setTitle(request.getTitle());
        job.setCompanyName(request.getCompanyName());
        job.setLocation(request.getLocation());
        job.setJobType(request.getJobType());
        job.setPostedByRecruiterId(request.getPostedByRecruiterId());
        job.setCreatedAt(Instant.now());

        Job savedJob = jobDao.save(job);
        return toResponse(savedJob);
    }

    @Override
    public List<JobResponse> getAllJobs() {
        return jobDao.findAllOrderByCreatedAtDesc().stream()
            .map(this::toResponse)
            .toList();
    }

    private JobResponse toResponse(Job job) {
        JobResponse response = new JobResponse();
        response.setId(job.getId());
        response.setTitle(job.getTitle());
        response.setCompanyName(job.getCompanyName());
        response.setLocation(job.getLocation());
        response.setJobType(job.getJobType());
        response.setPostedByRecruiterId(job.getPostedByRecruiterId());
        response.setCreatedAt(job.getCreatedAt());
        return response;
    }
}
