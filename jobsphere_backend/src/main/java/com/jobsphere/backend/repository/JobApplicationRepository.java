package com.jobsphere.backend.repository;

import com.jobsphere.backend.model.JobApplication;
import java.util.List;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface JobApplicationRepository extends MongoRepository<JobApplication, String> {
    boolean existsByJobIdAndStudentProfileId(String jobId, String studentProfileId);

    List<JobApplication> findAllByStudentProfileIdOrderByAppliedAtDesc(String studentProfileId);

    List<JobApplication> findAllByRecruiterProfileIdOrderByAppliedAtDesc(String recruiterProfileId);
}
