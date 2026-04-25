package com.jobsphere.backend.dto.application;

import jakarta.validation.constraints.NotBlank;

public class CreateApplicationRequest {

    @NotBlank(message = "jobId is required")
    private String jobId;

    @NotBlank(message = "studentProfileId is required")
    private String studentProfileId;

    private String coverLetter;

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

    public String getCoverLetter() {
        return coverLetter;
    }

    public void setCoverLetter(String coverLetter) {
        this.coverLetter = coverLetter;
    }
}
