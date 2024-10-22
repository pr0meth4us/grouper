package dev.prometheus.grouping.repository;

import dev.prometheus.grouping.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface UserRepository extends MongoRepository<User, String> {
}
