package com.jobsphere.backend.dto.job;

import jakarta.validation.constraints.NotBlank;

public class CreateJobRequest {

    @NotBlank(message = "title is required")
    private String title;

    @NotBlank(message = "companyName is required")
    private String companyName;

    @NotBlank(message = "location is required")
    private String location;

    @NotBlank(message = "jobType is required")
    private String jobType;

    @NotBlank(message = "postedByRecruiterId is required")
    private String postedByRecruiterId;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getJobType() {
        return jobType;
    }

    public void setJobType(String jobType) {
        this.jobType = jobType;
    }

    public String getPostedByRecruiterId() {
        return postedByRecruiterId;
    }

    public void setPostedByRecruiterId(String postedByRecruiterId) {
        this.postedByRecruiterId = postedByRecruiterId;
    }
}
