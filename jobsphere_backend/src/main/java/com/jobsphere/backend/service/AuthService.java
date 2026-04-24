package com.jobsphere.backend.service;

import com.jobsphere.backend.dto.auth.SignInRequest;
import com.jobsphere.backend.dto.auth.SignInResponse;
import com.jobsphere.backend.dto.auth.UsernameCheckResponse;

public interface AuthService {
    UsernameCheckResponse checkUsername(SignInRequest request);

    SignInResponse signIn(SignInRequest request);
}
