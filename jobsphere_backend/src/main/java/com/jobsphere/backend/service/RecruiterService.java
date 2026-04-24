package com.jobsphere.backend.service;

import com.jobsphere.backend.dto.recruiter.RecruiterProfileView;
import java.util.Optional;

public interface RecruiterService {

    Optional<RecruiterProfileView> getByProfileId(String profileId);
}
