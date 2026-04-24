package com.jobsphere.backend.repository;

import com.jobsphere.backend.model.UserAccount;
import com.jobsphere.backend.model.UserRole;
import java.util.Optional;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserAccountRepository extends MongoRepository<UserAccount, String> {
    Optional<UserAccount> findByUsernameIgnoreCaseAndRole(String username, UserRole role);
}
