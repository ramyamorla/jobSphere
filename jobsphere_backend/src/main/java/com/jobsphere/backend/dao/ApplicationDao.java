package com.jobsphere.backend.dao;

import com.jobsphere.backend.model.JobApplication;
import java.util.List;
import java.util.Optional;

public interface ApplicationDao {
    JobApplication save(JobApplication application);

    Optional<JobApplication> findById(String applicationId);

    boolean existsByJobIdAndStudentProfileId(String jobId, String studentProfileId);

    List<JobApplication> findByStudentProfileId(String studentProfileId);

    List<JobApplication> findByRecruiterProfileId(String recruiterProfileId);
}
