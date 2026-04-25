package com.jobsphere.backend.service;

import com.jobsphere.backend.dto.application.ApplicationView;
import com.jobsphere.backend.dto.application.CreateApplicationRequest;
import com.jobsphere.backend.model.ApplicationStatus;
import java.util.List;

public interface ApplicationService {

    ApplicationView apply(CreateApplicationRequest request);

    List<ApplicationView> getByStudentProfile(String studentProfileId);

    List<ApplicationView> getByRecruiterProfile(String recruiterProfileId);

    ApplicationView updateStatus(String applicationId, ApplicationStatus status);
}
