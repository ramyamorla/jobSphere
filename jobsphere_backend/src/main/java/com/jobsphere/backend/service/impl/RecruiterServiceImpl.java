package com.jobsphere.backend.service.impl;

import com.jobsphere.backend.dao.RecruiterProfileDao;
import com.jobsphere.backend.dto.recruiter.RecruiterProfileView;
import com.jobsphere.backend.model.RecruiterProfile;
import com.jobsphere.backend.service.RecruiterService;
import java.util.Optional;
import org.springframework.stereotype.Service;

@Service
public class RecruiterServiceImpl implements RecruiterService {

    private final RecruiterProfileDao recruiterProfileDao;

    public RecruiterServiceImpl(RecruiterProfileDao recruiterProfileDao) {
        this.recruiterProfileDao = recruiterProfileDao;
    }

    @Override
    public Optional<RecruiterProfileView> getByProfileId(String profileId) {
        return recruiterProfileDao
            .findById(profileId)
            .map(RecruiterServiceImpl::toView);
    }

    private static RecruiterProfileView toView(RecruiterProfile p) {
        RecruiterProfileView v = new RecruiterProfileView();
        v.setId(p.getId());
        v.setCompanyName(p.getCompanyName() != null ? p.getCompanyName() : "");
        v.setDisplayName(p.getDisplayName() != null ? p.getDisplayName() : "");
        return v;
    }
}
