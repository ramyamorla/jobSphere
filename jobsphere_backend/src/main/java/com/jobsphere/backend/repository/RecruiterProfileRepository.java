package com.jobsphere.backend.repository;

import com.jobsphere.backend.model.RecruiterProfile;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RecruiterProfileRepository extends MongoRepository<RecruiterProfile, String> {
}
