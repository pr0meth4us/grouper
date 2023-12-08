package dev.prometheus.grouping;

import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;
import java.util.UUID;

    public interface Repository extends MongoRepository<Student, String> {

    Optional<Student> findById(UUID id);

    void deleteById(UUID id);
    boolean existsByName(String name);
}
