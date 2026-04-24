package com.jobsphere.backend.dto.job;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.List;

public class CreateJobRequest {

    @NotBlank(message = "title is required")
    private String title;

    @NotBlank(message = "companyName is required")
    private String companyName;

    @NotBlank(message = "location is required")
    private String location;

    @NotBlank(message = "jobType is required")
    private String jobType;

    @NotBlank(message = "workMode is required")
    private String workMode;

    @NotBlank(message = "experienceLevel is required")
    private String experienceLevel;

    @NotNull(message = "minSalary is required")
    @Positive(message = "minSalary must be positive")
    private Integer minSalary;

    @NotNull(message = "maxSalary is required")
    @Positive(message = "maxSalary must be positive")
    private Integer maxSalary;

    @NotBlank(message = "salaryCurrency is required")
    private String salaryCurrency;

    @NotNull(message = "totalPositions is required")
    @Positive(message = "totalPositions must be positive")
    private Integer totalPositions;

    private List<String> requiredSkills;

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

    public String getWorkMode() {
        return workMode;
    }

    public void setWorkMode(String workMode) {
        this.workMode = workMode;
    }

    public String getExperienceLevel() {
        return experienceLevel;
    }

    public void setExperienceLevel(String experienceLevel) {
        this.experienceLevel = experienceLevel;
    }

    public Integer getMinSalary() {
        return minSalary;
    }

    public void setMinSalary(Integer minSalary) {
        this.minSalary = minSalary;
    }

    public Integer getMaxSalary() {
        return maxSalary;
    }

    public void setMaxSalary(Integer maxSalary) {
        this.maxSalary = maxSalary;
    }

    public String getSalaryCurrency() {
        return salaryCurrency;
    }

    public void setSalaryCurrency(String salaryCurrency) {
        this.salaryCurrency = salaryCurrency;
    }

    public Integer getTotalPositions() {
        return totalPositions;
    }

    public void setTotalPositions(Integer totalPositions) {
        this.totalPositions = totalPositions;
    }

    public List<String> getRequiredSkills() {
        return requiredSkills;
    }

    public void setRequiredSkills(List<String> requiredSkills) {
        this.requiredSkills = requiredSkills;
    }

    public String getPostedByRecruiterId() {
        return postedByRecruiterId;
    }

    public void setPostedByRecruiterId(String postedByRecruiterId) {
        this.postedByRecruiterId = postedByRecruiterId;
    }
}
