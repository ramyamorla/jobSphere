package com.jobsphere.backend.dao;

import com.jobsphere.backend.model.UserAccount;
import com.jobsphere.backend.model.UserRole;
import java.util.Optional;

public interface UserAccountDao {
    Optional<UserAccount> findByUsernameAndRole(String username, UserRole role);

    UserAccount save(UserAccount userAccount);
}
