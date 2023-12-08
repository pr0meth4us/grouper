package dev.prometheus.grouping.exclude;


import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;

public interface TempoRepo extends MongoRepository<Exclude,String> {
    void deleteById(String id);

    void deleteByIdIn(List<String> excludeIds);

    void deleteByNameIn(List<String> names);
}
