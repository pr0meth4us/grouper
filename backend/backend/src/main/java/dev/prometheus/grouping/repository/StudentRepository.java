package dev.prometheus.grouping.repository;

import dev.prometheus.grouping.model.Student;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface StudentRepository extends MongoRepository<Student, String> {
    boolean existsByName(String name);
}
