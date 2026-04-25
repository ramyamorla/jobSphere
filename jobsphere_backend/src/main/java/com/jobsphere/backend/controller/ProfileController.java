package com.jobsphere.backend.controller;

import com.jobsphere.backend.dto.profile.StudentProfileView;
import com.jobsphere.backend.dto.profile.UpdateRecruiterProfileRequest;
import com.jobsphere.backend.dto.profile.UpdateStudentProfileRequest;
import com.jobsphere.backend.dto.recruiter.RecruiterProfileView;
import com.jobsphere.backend.service.ProfileService;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestPart;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@RestController
@RequestMapping("/api/profiles")
public class ProfileController {

    private static final Path RESUME_UPLOAD_DIR = Paths.get("uploads", "resumes");

    private final ProfileService profileService;

    public ProfileController(ProfileService profileService) {
        this.profileService = profileService;
    }

    @GetMapping("/student/{profileId}")
    public StudentProfileView getStudentProfile(@PathVariable String profileId) {
        return profileService.getStudentProfile(profileId);
    }

    @PutMapping("/student/{profileId}")
    public StudentProfileView updateStudentProfile(
        @PathVariable String profileId,
        @RequestBody UpdateStudentProfileRequest request
    ) {
        return profileService.updateStudentProfile(profileId, request);
    }

    @PostMapping(value = "/student/{profileId}/resume", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public StudentProfileView uploadStudentResume(
        @PathVariable String profileId,
        @RequestPart("file") MultipartFile file
    ) {
        return profileService.uploadStudentResume(profileId, file);
    }

    @GetMapping("/recruiter/{profileId}")
    public RecruiterProfileView getRecruiterProfile(@PathVariable String profileId) {
        return profileService.getRecruiterProfile(profileId);
    }

    @PutMapping("/recruiter/{profileId}")
    public RecruiterProfileView updateRecruiterProfile(
        @PathVariable String profileId,
        @RequestBody UpdateRecruiterProfileRequest request
    ) {
        return profileService.updateRecruiterProfile(profileId, request);
    }

    @GetMapping("/resume-files/{fileName}")
    public ResponseEntity<Resource> downloadResume(@PathVariable String fileName) {
        Path base = RESUME_UPLOAD_DIR.toAbsolutePath().normalize();
        Path file = base.resolve(fileName).normalize();
        if (!file.startsWith(base) || !Files.exists(file)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Resume not found");
        }
        Resource resource = new FileSystemResource(file);
        return ResponseEntity.ok()
            .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + file.getFileName().toString() + "\"")
            .contentType(MediaType.APPLICATION_OCTET_STREAM)
            .body(resource);
    }
}
