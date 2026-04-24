package com.jobsphere.backend.repository;

import com.jobsphere.backend.model.StudentProfile;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StudentProfileRepository extends MongoRepository<StudentProfile, String> {
}
