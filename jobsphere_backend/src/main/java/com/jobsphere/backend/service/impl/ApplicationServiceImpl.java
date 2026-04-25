package com.jobsphere.backend.service.impl;

import com.jobsphere.backend.dao.ApplicationDao;
import com.jobsphere.backend.dao.JobDao;
import com.jobsphere.backend.dao.StudentProfileDao;
import com.jobsphere.backend.dto.application.ApplicationView;
import com.jobsphere.backend.dto.application.CreateApplicationRequest;
import com.jobsphere.backend.model.ApplicationStatus;
import com.jobsphere.backend.model.Job;
import com.jobsphere.backend.model.JobApplication;
import com.jobsphere.backend.model.StudentProfile;
import com.jobsphere.backend.service.ApplicationService;
import java.time.Instant;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ApplicationServiceImpl implements ApplicationService {

    private final ApplicationDao applicationDao;
    private final JobDao jobDao;
    private final StudentProfileDao studentProfileDao;

    public ApplicationServiceImpl(ApplicationDao applicationDao, JobDao jobDao, StudentProfileDao studentProfileDao) {
        this.applicationDao = applicationDao;
        this.jobDao = jobDao;
        this.studentProfileDao = studentProfileDao;
    }

    @Override
    public ApplicationView apply(CreateApplicationRequest request) {
        String jobId = request.getJobId().trim();
        String studentProfileId = request.getStudentProfileId().trim();

        if (applicationDao.existsByJobIdAndStudentProfileId(jobId, studentProfileId)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Already applied to this job");
        }

        Job job = jobDao.findById(jobId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Job not found"));

        if (job.getOpenPositions() == null || job.getOpenPositions() <= 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "No open positions left");
        }

        StudentProfile student = studentProfileDao.findById(studentProfileId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student profile not found"));

        Instant now = Instant.now();
        JobApplication application = new JobApplication();
        application.setJobId(job.getId());
        application.setStudentProfileId(studentProfileId);
        application.setRecruiterProfileId(job.getPostedByRecruiterId());
        application.setCoverLetter(normalize(request.getCoverLetter()));
        application.setResumeUrlSnapshot(student.getResumeUrl());
        application.setStatus(ApplicationStatus.APPLIED);
        application.setAppliedAt(now);
        application.setUpdatedAt(now);
        JobApplication saved = applicationDao.save(application);

        job.setOpenPositions(Math.max(0, job.getOpenPositions() - 1));
        jobDao.save(job);

        return toView(saved, job);
    }

    @Override
    public List<ApplicationView> getByStudentProfile(String studentProfileId) {
        return applicationDao.findByStudentProfileId(studentProfileId).stream()
            .map(application -> toView(application, jobDao.findById(application.getJobId()).orElse(null)))
            .toList();
    }

    @Override
    public List<ApplicationView> getByRecruiterProfile(String recruiterProfileId) {
        return applicationDao.findByRecruiterProfileId(recruiterProfileId).stream()
            .map(application -> toView(application, jobDao.findById(application.getJobId()).orElse(null)))
            .toList();
    }

    @Override
    public ApplicationView updateStatus(String applicationId, ApplicationStatus status) {
        JobApplication application = applicationDao.findById(applicationId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Application not found"));
        application.setStatus(status);
        application.setUpdatedAt(Instant.now());
        JobApplication saved = applicationDao.save(application);
        return toView(saved, jobDao.findById(saved.getJobId()).orElse(null));
    }

    private ApplicationView toView(JobApplication application, Job job) {
        ApplicationView view = new ApplicationView();
        view.setId(application.getId());
        view.setJobId(application.getJobId());
        view.setStudentProfileId(application.getStudentProfileId());
        view.setRecruiterProfileId(application.getRecruiterProfileId());
        view.setCoverLetter(application.getCoverLetter() == null ? "" : application.getCoverLetter());
        view.setResumeUrl(application.getResumeUrlSnapshot() == null ? "" : application.getResumeUrlSnapshot());
        view.setStatus(application.getStatus());
        view.setAppliedAt(application.getAppliedAt());
        if (job != null) {
            view.setJobTitle(job.getTitle());
            view.setCompanyName(job.getCompanyName());
        } else {
            view.setJobTitle("(Deleted Job)");
            view.setCompanyName("");
        }
        return view;
    }

    private String normalize(String text) {
        if (text == null) {
            return "";
        }
        return text.trim();
    }
}
