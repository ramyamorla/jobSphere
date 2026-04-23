package com.jobsphere.backend.controller;

import java.util.Map;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class HealthController {

    private final MongoTemplate mongoTemplate;

    public HealthController(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    @GetMapping("/health")
    public Map<String, String> health() {
        return Map.of("status", "UP", "service", "jobsphere-backend");
    }

    @GetMapping("/health/db")
    public Map<String, String> dbHealth() {
        try {
            mongoTemplate.getDb().runCommand(new org.bson.Document("ping", 1));
            return Map.of("status", "UP", "database", "mongodb");
        } catch (Exception ex) {
            return Map.of("status", "DOWN", "database", "mongodb", "error", ex.getMessage());
        }
    }
}
