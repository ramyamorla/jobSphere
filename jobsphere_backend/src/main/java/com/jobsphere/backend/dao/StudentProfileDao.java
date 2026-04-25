package com.jobsphere.backend.dao;

import com.jobsphere.backend.model.StudentProfile;
import java.util.Optional;

public interface StudentProfileDao {
    StudentProfile save(StudentProfile studentProfile);

    Optional<StudentProfile> findById(String id);
}
