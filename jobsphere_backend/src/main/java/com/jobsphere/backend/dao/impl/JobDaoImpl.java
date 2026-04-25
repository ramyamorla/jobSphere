package com.jobsphere.backend.dao.impl;

import com.jobsphere.backend.dao.JobDao;
import com.jobsphere.backend.model.Job;
import com.jobsphere.backend.repository.JobRepository;
import java.util.List;
import java.util.Optional;
import java.util.regex.Pattern;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.stereotype.Repository;

@Repository
public class JobDaoImpl implements JobDao {

    private final JobRepository jobRepository;
    private final MongoTemplate mongoTemplate;

    public JobDaoImpl(JobRepository jobRepository, MongoTemplate mongoTemplate) {
        this.jobRepository = jobRepository;
        this.mongoTemplate = mongoTemplate;
    }

    @Override
    public Job save(Job job) {
        return jobRepository.save(job);
    }

    @Override
    public List<Job> findAllOrderByCreatedAtDesc() {
        return jobRepository.findAllByOrderByCreatedAtDesc();
    }

    @Override
    public List<Job> search(String keyword, String location, String jobType, String workMode, Integer minSalary) {
        Query query = new Query();
        query.with(Sort.by(Sort.Direction.DESC, "createdAt"));

        if (keyword != null && !keyword.isBlank()) {
            String regex = ".*" + Pattern.quote(keyword.trim()) + ".*";
            query.addCriteria(new Criteria().orOperator(
                Criteria.where("title").regex(regex, "i"),
                Criteria.where("companyName").regex(regex, "i")
            ));
        }

        if (location != null && !location.isBlank()) {
            query.addCriteria(Criteria.where("location").is(location.trim()));
        }

        if (jobType != null && !jobType.isBlank()) {
            query.addCriteria(Criteria.where("jobType").is(jobType.trim()));
        }

        if (workMode != null && !workMode.isBlank()) {
            query.addCriteria(Criteria.where("workMode").is(workMode.trim()));
        }

        if (minSalary != null) {
            query.addCriteria(Criteria.where("maxSalary").gte(minSalary));
        }

        return mongoTemplate.find(query, Job.class);
    }

    @Override
    public Optional<Job> findById(String jobId) {
        return jobRepository.findById(jobId);
    }

    @Override
    public boolean existsById(String jobId) {
        return jobRepository.existsById(jobId);
    }

    @Override
    public void deleteById(String jobId) {
        jobRepository.deleteById(jobId);
    }
}
