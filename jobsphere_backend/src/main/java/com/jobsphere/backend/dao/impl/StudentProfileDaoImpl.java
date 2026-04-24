package com.jobsphere.backend.dao.impl;

import com.jobsphere.backend.dao.StudentProfileDao;
import com.jobsphere.backend.model.StudentProfile;
import com.jobsphere.backend.repository.StudentProfileRepository;
import org.springframework.stereotype.Repository;

@Repository
public class StudentProfileDaoImpl implements StudentProfileDao {

    private final StudentProfileRepository studentProfileRepository;

    public StudentProfileDaoImpl(StudentProfileRepository studentProfileRepository) {
        this.studentProfileRepository = studentProfileRepository;
    }

    @Override
    public StudentProfile save(StudentProfile studentProfile) {
        return studentProfileRepository.save(studentProfile);
    }
}
