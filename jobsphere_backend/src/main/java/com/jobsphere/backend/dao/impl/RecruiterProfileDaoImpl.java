package com.jobsphere.backend.dao.impl;

import com.jobsphere.backend.dao.RecruiterProfileDao;
import com.jobsphere.backend.model.RecruiterProfile;
import com.jobsphere.backend.repository.RecruiterProfileRepository;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class RecruiterProfileDaoImpl implements RecruiterProfileDao {

    private final RecruiterProfileRepository recruiterProfileRepository;

    public RecruiterProfileDaoImpl(RecruiterProfileRepository recruiterProfileRepository) {
        this.recruiterProfileRepository = recruiterProfileRepository;
    }

    @Override
    public RecruiterProfile save(RecruiterProfile recruiterProfile) {
        return recruiterProfileRepository.save(recruiterProfile);
    }

    @Override
    public Optional<RecruiterProfile> findById(String id) {
        return recruiterProfileRepository.findById(id);
    }
}
