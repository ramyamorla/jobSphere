package com.jobsphere.backend.dto.application;

import com.jobsphere.backend.model.ApplicationStatus;
import java.time.Instant;

public class ApplicationView {

    private String id;
    private String jobId;
    private String jobTitle;
    private String companyName;
    private String studentProfileId;
    private String recruiterProfileId;
    private String coverLetter;
    private String resumeUrl;
    private ApplicationStatus status;
    private Instant appliedAt;

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

    public String getJobTitle() {
        return jobTitle;
    }

    public void setJobTitle(String jobTitle) {
        this.jobTitle = jobTitle;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
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

    public String getResumeUrl() {
        return resumeUrl;
    }

    public void setResumeUrl(String resumeUrl) {
        this.resumeUrl = resumeUrl;
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
}
