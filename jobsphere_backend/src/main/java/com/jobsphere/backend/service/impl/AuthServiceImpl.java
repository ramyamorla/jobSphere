package com.jobsphere.backend.service.impl;

import com.jobsphere.backend.dao.RecruiterProfileDao;
import com.jobsphere.backend.dao.StudentProfileDao;
import com.jobsphere.backend.dao.UserAccountDao;
import com.jobsphere.backend.dto.auth.SignInRequest;
import com.jobsphere.backend.dto.auth.SignInResponse;
import com.jobsphere.backend.dto.auth.UsernameCheckResponse;
import com.jobsphere.backend.model.RecruiterProfile;
import com.jobsphere.backend.model.StudentProfile;
import com.jobsphere.backend.model.UserAccount;
import com.jobsphere.backend.model.UserRole;
import com.jobsphere.backend.service.AuthService;
import java.time.Instant;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserAccountDao userAccountDao;
    private final RecruiterProfileDao recruiterProfileDao;
    private final StudentProfileDao studentProfileDao;

    public AuthServiceImpl(
        UserAccountDao userAccountDao,
        RecruiterProfileDao recruiterProfileDao,
        StudentProfileDao studentProfileDao
    ) {
        this.userAccountDao = userAccountDao;
        this.recruiterProfileDao = recruiterProfileDao;
        this.studentProfileDao = studentProfileDao;
    }

    @Override
    public UsernameCheckResponse checkUsername(SignInRequest request) {
        String normalizedUsername = normalizeUsername(request.getUsername());
        UserRole role = parseRole(request.getRole());
        boolean exists = userAccountDao.findByUsernameAndRole(normalizedUsername, role).isPresent();
        return new UsernameCheckResponse(exists);
    }

    @Override
    public SignInResponse signIn(SignInRequest request) {
        String normalizedUsername = normalizeUsername(request.getUsername());
        UserRole role = parseRole(request.getRole());

        return userAccountDao.findByUsernameAndRole(normalizedUsername, role)
            .map(existingUser -> toSignInResponse(existingUser, false))
            .orElseGet(() -> createNewUser(normalizedUsername, role));
    }

    private SignInResponse createNewUser(String username, UserRole role) {
        Instant now = Instant.now();

        UserAccount user = new UserAccount();
        user.setUsername(username);
        user.setRole(role);
        user.setCreatedAt(now);
        UserAccount savedUser = userAccountDao.save(user);

        if (role == UserRole.RECRUITER) {
            RecruiterProfile recruiterProfile = new RecruiterProfile();
            recruiterProfile.setUserId(savedUser.getId());
            recruiterProfile.setDisplayName(username);
            recruiterProfile.setCompanyName("");
            recruiterProfile.setCreatedAt(now);
            RecruiterProfile savedRecruiter = recruiterProfileDao.save(recruiterProfile);
            savedUser.setProfileId(savedRecruiter.getId());
        } else {
            StudentProfile studentProfile = new StudentProfile();
            studentProfile.setUserId(savedUser.getId());
            studentProfile.setDisplayName(username);
            studentProfile.setBio("");
            studentProfile.setSkills(List.of());
            studentProfile.setCreatedAt(now);
            StudentProfile savedStudent = studentProfileDao.save(studentProfile);
            savedUser.setProfileId(savedStudent.getId());
        }

        UserAccount updatedUser = userAccountDao.save(savedUser);
        return toSignInResponse(updatedUser, true);
    }

    private SignInResponse toSignInResponse(UserAccount user, boolean isNewUser) {
        SignInResponse response = new SignInResponse();
        response.setUserId(user.getId());
        response.setUsername(user.getUsername());
        response.setRole(user.getRole().name());
        response.setProfileId(user.getProfileId());
        response.setNewUser(isNewUser);
        return response;
    }

    private String normalizeUsername(String username) {
        return username == null ? "" : username.trim().toLowerCase();
    }

    private UserRole parseRole(String role) {
        try {
            return UserRole.valueOf(role.trim().toUpperCase());
        } catch (Exception ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Invalid role. Use STUDENT or RECRUITER");
        }
    }
}
