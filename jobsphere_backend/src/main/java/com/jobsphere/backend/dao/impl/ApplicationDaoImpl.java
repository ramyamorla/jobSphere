package com.jobsphere.backend.dao.impl;

import com.jobsphere.backend.dao.ApplicationDao;
import com.jobsphere.backend.model.JobApplication;
import com.jobsphere.backend.repository.JobApplicationRepository;
import java.util.List;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class ApplicationDaoImpl implements ApplicationDao {

    private final JobApplicationRepository jobApplicationRepository;

    public ApplicationDaoImpl(JobApplicationRepository jobApplicationRepository) {
        this.jobApplicationRepository = jobApplicationRepository;
    }

    @Override
    public JobApplication save(JobApplication application) {
        return jobApplicationRepository.save(application);
    }

    @Override
    public Optional<JobApplication> findById(String applicationId) {
        return jobApplicationRepository.findById(applicationId);
    }

    @Override
    public boolean existsByJobIdAndStudentProfileId(String jobId, String studentProfileId) {
        return jobApplicationRepository.existsByJobIdAndStudentProfileId(jobId, studentProfileId);
    }

    @Override
    public List<JobApplication> findByStudentProfileId(String studentProfileId) {
        return jobApplicationRepository.findAllByStudentProfileIdOrderByAppliedAtDesc(studentProfileId);
    }

    @Override
    public List<JobApplication> findByRecruiterProfileId(String recruiterProfileId) {
        return jobApplicationRepository.findAllByRecruiterProfileIdOrderByAppliedAtDesc(recruiterProfileId);
    }
}
