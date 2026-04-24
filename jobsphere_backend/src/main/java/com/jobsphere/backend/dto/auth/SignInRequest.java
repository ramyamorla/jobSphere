package com.jobsphere.backend.dto.auth;

import jakarta.validation.constraints.NotBlank;

public class SignInRequest {

    @NotBlank(message = "username is required")
    private String username;

    @NotBlank(message = "role is required")
    private String role;

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
