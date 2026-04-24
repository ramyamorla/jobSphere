package com.jobsphere.backend.controller;

import com.jobsphere.backend.dto.auth.SignInRequest;
import com.jobsphere.backend.dto.auth.SignInResponse;
import com.jobsphere.backend.dto.auth.UsernameCheckResponse;
import com.jobsphere.backend.service.AuthService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/check-username")
    public UsernameCheckResponse checkUsername(@Valid @RequestBody SignInRequest request) {
        return authService.checkUsername(request);
    }

    @PostMapping("/sign-in")
    public SignInResponse signIn(@Valid @RequestBody SignInRequest request) {
        return authService.signIn(request);
    }
}
