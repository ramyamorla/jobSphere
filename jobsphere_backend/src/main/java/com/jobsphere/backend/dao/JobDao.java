package com.jobsphere.backend.dao;

import com.jobsphere.backend.model.Job;
import java.util.List;
import java.util.Optional;

public interface JobDao {
    Job save(Job job);

    List<Job> findAllOrderByCreatedAtDesc();

    List<Job> search(String keyword, String location, String jobType, String workMode, Integer minSalary);

    Optional<Job> findById(String jobId);

    boolean existsById(String jobId);

    void deleteById(String jobId);
}
