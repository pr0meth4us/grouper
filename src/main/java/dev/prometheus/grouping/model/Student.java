package dev.prometheus.grouping.model;

import lombok.Data;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

@Data
@Document(collection = "students")
public class Student {
    @Id
    private String id = UUID.randomUUID().toString();
    private String name;
}