package com.jobsphere.backend.dao.impl;

import com.jobsphere.backend.dao.JobDao;
import com.jobsphere.backend.model.Job;
import com.jobsphere.backend.repository.JobRepository;
import java.util.List;
import org.springframework.stereotype.Repository;

@Repository
public class JobDaoImpl implements JobDao {

    private final JobRepository jobRepository;

    public JobDaoImpl(JobRepository jobRepository) {
        this.jobRepository = jobRepository;
    }

    @Override
    public Job save(Job job) {
        return jobRepository.save(job);
    }

    @Override
    public List<Job> findAllOrderByCreatedAtDesc() {
        return jobRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    public boolean existsById(String jobId) {
        return jobRepository.existsById(jobId);
    }

    @Override
    public void deleteById(String jobId) {
        jobRepository.deleteById(jobId);
    }
}
