package com.jobsphere.backend.repository;

import com.jobsphere.backend.model.Job;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface JobRepository extends MongoRepository<Job, String> {
    List<Job> findAllByOrderByCreatedAtDesc();

    boolean existsById(String id);
}
