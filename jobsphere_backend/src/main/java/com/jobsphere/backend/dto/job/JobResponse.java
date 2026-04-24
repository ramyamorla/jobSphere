package com.jobsphere.backend.dto.job;

import java.time.Instant;

public class JobResponse {

    private String id;
    private String title;
    private String companyName;
    private String location;
    private String jobType;
    private String postedByRecruiterId;
    private Instant createdAt;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

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

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
