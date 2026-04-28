package com.jobsphere.backend.dao.impl;

import com.jobsphere.backend.dao.UserAccountDao;
import com.jobsphere.backend.model.UserAccount;
import com.jobsphere.backend.model.UserRole;
import com.jobsphere.backend.repository.UserAccountRepository;
import java.util.Optional;
import org.springframework.stereotype.Repository;

@Repository
public class UserAccountDaoImpl implements UserAccountDao {

    private final UserAccountRepository userAccountRepository;

    public UserAccountDaoImpl(UserAccountRepository userAccountRepository) {
        this.userAccountRepository = userAccountRepository;
    }

    @Override
    public Optional<UserAccount> findByUsernameAndRole(String username, UserRole role) {
        //String sql = "select * from users where username=?, role=?"
        //UserAcciount userfound = mongoConnection(MONGO_URI).getExistsUser(username, role, sql)
        //if(userfound) return UserAccount else throw exception "Not Found"
        return userAccountRepository.findByUsernameIgnoreCaseAndRole(username, role);
    }

    @Override
    public UserAccount save(UserAccount userAccount) {
        return userAccountRepository.save(userAccount);
    }
}
