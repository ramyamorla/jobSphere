package com.jobsphere.backend.service.impl;

import com.jobsphere.backend.dao.RecruiterProfileDao;
import com.jobsphere.backend.dao.StudentProfileDao;
import com.jobsphere.backend.dto.profile.StudentProfileView;
import com.jobsphere.backend.dto.profile.UpdateRecruiterProfileRequest;
import com.jobsphere.backend.dto.profile.UpdateStudentProfileRequest;
import com.jobsphere.backend.dto.recruiter.RecruiterProfileView;
import com.jobsphere.backend.model.RecruiterProfile;
import com.jobsphere.backend.model.StudentProfile;
import com.jobsphere.backend.service.ProfileService;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@Service
public class ProfileServiceImpl implements ProfileService {

    private static final Path RESUME_UPLOAD_DIR = Paths.get("uploads", "resumes");

    private final StudentProfileDao studentProfileDao;
    private final RecruiterProfileDao recruiterProfileDao;

    public ProfileServiceImpl(StudentProfileDao studentProfileDao, RecruiterProfileDao recruiterProfileDao) {
        this.studentProfileDao = studentProfileDao;
        this.recruiterProfileDao = recruiterProfileDao;
    }

    @Override
    public StudentProfileView getStudentProfile(String profileId) {
        StudentProfile student = getStudentById(profileId);
        return toStudentView(student);
    }

    @Override
    public StudentProfileView updateStudentProfile(String profileId, UpdateStudentProfileRequest request) {
        StudentProfile student = getStudentById(profileId);
        student.setDisplayName(normalize(request.getDisplayName(), student.getDisplayName()));
        student.setEmail(normalize(request.getEmail(), student.getEmail()));
        student.setCollegeName(normalize(request.getCollegeName(), student.getCollegeName()));
        student.setBio(normalize(request.getBio(), student.getBio()));
        student.setSkills(request.getSkills() == null ? List.of() : new ArrayList<>(request.getSkills()));
        student.setUpdatedAt(Instant.now());
        StudentProfile saved = studentProfileDao.save(student);
        return toStudentView(saved);
    }

    @Override
    public StudentProfileView uploadStudentResume(String profileId, MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Resume file is required");
        }
        StudentProfile student = getStudentById(profileId);

        try {
            Files.createDirectories(RESUME_UPLOAD_DIR);
            String safeName = sanitizeFilename(file.getOriginalFilename());
            String filename = profileId + "-" + UUID.randomUUID() + "-" + safeName;
            Path target = RESUME_UPLOAD_DIR.resolve(filename);
            Files.copy(file.getInputStream(), target, StandardCopyOption.REPLACE_EXISTING);
            student.setResumeUrl("/api/profiles/resume-files/" + filename);
            student.setUpdatedAt(Instant.now());
            StudentProfile saved = studentProfileDao.save(student);
            return toStudentView(saved);
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Unable to store resume");
        }
    }

    @Override
    public RecruiterProfileView getRecruiterProfile(String profileId) {
        RecruiterProfile recruiter = getRecruiterById(profileId);
        return toRecruiterView(recruiter);
    }

    @Override
    public RecruiterProfileView updateRecruiterProfile(String profileId, UpdateRecruiterProfileRequest request) {
        RecruiterProfile recruiter = getRecruiterById(profileId);
        recruiter.setDisplayName(normalize(request.getDisplayName(), recruiter.getDisplayName()));
        recruiter.setEmail(normalize(request.getEmail(), recruiter.getEmail()));
        recruiter.setCompanyName(normalize(request.getCompanyName(), recruiter.getCompanyName()));
        recruiter.setUpdatedAt(Instant.now());
        RecruiterProfile saved = recruiterProfileDao.save(recruiter);
        return toRecruiterView(saved);
    }

    private StudentProfile getStudentById(String profileId) {
        return studentProfileDao
            .findById(profileId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Student profile not found"));
    }

    private RecruiterProfile getRecruiterById(String profileId) {
        return recruiterProfileDao
            .findById(profileId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recruiter profile not found"));
    }

    private StudentProfileView toStudentView(StudentProfile student) {
        StudentProfileView view = new StudentProfileView();
        view.setId(student.getId());
        view.setDisplayName(orEmpty(student.getDisplayName()));
        view.setEmail(orEmpty(student.getEmail()));
        view.setCollegeName(orEmpty(student.getCollegeName()));
        view.setBio(orEmpty(student.getBio()));
        view.setSkills(student.getSkills() == null ? List.of() : student.getSkills());
        view.setResumeUrl(orEmpty(student.getResumeUrl()));
        return view;
    }

    private RecruiterProfileView toRecruiterView(RecruiterProfile recruiter) {
        RecruiterProfileView view = new RecruiterProfileView();
        view.setId(recruiter.getId());
        view.setDisplayName(orEmpty(recruiter.getDisplayName()));
        view.setCompanyName(orEmpty(recruiter.getCompanyName()));
        return view;
    }

    private String normalize(String value, String fallback) {
        if (value == null) {
            return fallback;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? fallback : trimmed;
    }

    private String orEmpty(String value) {
        return value == null ? "" : value;
    }

    private String sanitizeFilename(String fileName) {
        String source = fileName == null || fileName.isBlank() ? "resume" : fileName;
        return source.replaceAll("[^a-zA-Z0-9._-]", "_");
    }
}
