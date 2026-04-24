package com.jobsphere.backend.dao;

import com.jobsphere.backend.model.Job;
import java.util.List;

public interface JobDao {
    Job save(Job job);

    List<Job> findAllOrderByCreatedAtDesc();

    boolean existsById(String jobId);

    void deleteById(String jobId);
}
