package com.jobsphere.backend.model;

import java.time.Instant;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "applications")
public class JobApplication {

    @Id
    private String id;
    private String jobId;
    private String studentProfileId;
    private String recruiterProfileId;
    private String coverLetter;
    private String resumeUrlSnapshot;
    private ApplicationStatus status;
    private Instant appliedAt;
    private Instant updatedAt;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getJobId() {
        return jobId;
    }

    public void setJobId(String jobId) {
        this.jobId = jobId;
    }

    public String getStudentProfileId() {
        return studentProfileId;
    }

    public void setStudentProfileId(String studentProfileId) {
        this.studentProfileId = studentProfileId;
    }

    public String getRecruiterProfileId() {
        return recruiterProfileId;
    }

    public void setRecruiterProfileId(String recruiterProfileId) {
        this.recruiterProfileId = recruiterProfileId;
    }

    public String getCoverLetter() {
        return coverLetter;
    }

    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
    }

    public String getResumeUrlSnapshot() {
        return resumeUrlSnapshot;
    }

    public void setResumeUrlSnapshot(String resumeUrlSnapshot) {
        this.resumeUrlSnapshot = resumeUrlSnapshot;
    }

    public ApplicationStatus getStatus() {
        return status;
    }

    public void setStatus(ApplicationStatus status) {
        this.status = status;
    }

    public Instant getAppliedAt() {
        return appliedAt;
    }

    public void setAppliedAt(Instant appliedAt) {
        this.appliedAt = appliedAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
