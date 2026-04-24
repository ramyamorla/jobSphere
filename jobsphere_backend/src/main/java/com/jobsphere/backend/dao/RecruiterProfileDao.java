package com.jobsphere.backend.dao;

import com.jobsphere.backend.model.RecruiterProfile;
import java.util.Optional;

public interface RecruiterProfileDao {
    RecruiterProfile save(RecruiterProfile recruiterProfile);

    Optional<RecruiterProfile> findById(String id);
}
