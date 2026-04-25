package com.jobsphere.backend.service;

import com.jobsphere.backend.dto.profile.StudentProfileView;
import com.jobsphere.backend.dto.profile.UpdateRecruiterProfileRequest;
import com.jobsphere.backend.dto.profile.UpdateStudentProfileRequest;
import com.jobsphere.backend.dto.recruiter.RecruiterProfileView;
import org.springframework.web.multipart.MultipartFile;

public interface ProfileService {

    StudentProfileView getStudentProfile(String profileId);

    StudentProfileView updateStudentProfile(String profileId, UpdateStudentProfileRequest request);

    StudentProfileView uploadStudentResume(String profileId, MultipartFile file);

    RecruiterProfileView getRecruiterProfile(String profileId);

    RecruiterProfileView updateRecruiterProfile(String profileId, UpdateRecruiterProfileRequest request);
}
