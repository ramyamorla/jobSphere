package com.jobsphere.backend.controller;

import com.jobsphere.backend.dto.application.ApplicationView;
import com.jobsphere.backend.dto.application.CreateApplicationRequest;
import com.jobsphere.backend.model.ApplicationStatus;
import com.jobsphere.backend.service.ApplicationService;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/applications")
public class ApplicationController {

    private final ApplicationService applicationService;

    public ApplicationController(ApplicationService applicationService) {
        this.applicationService = applicationService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ApplicationView apply(@Valid @RequestBody CreateApplicationRequest request) {
        return applicationService.apply(request);
    }

    @GetMapping("/student/{profileId}")
    public List<ApplicationView> getByStudent(@PathVariable String profileId) {
        return applicationService.getByStudentProfile(profileId);
    }

    @GetMapping("/recruiter/{profileId}")
    public List<ApplicationView> getByRecruiter(@PathVariable String profileId) {
        return applicationService.getByRecruiterProfile(profileId);
    }

    @PatchMapping("/{applicationId}/status")
    public ApplicationView updateStatus(
        @PathVariable String applicationId,
        @RequestParam ApplicationStatus status
    ) {
        return applicationService.updateStatus(applicationId, status);
    }
}
