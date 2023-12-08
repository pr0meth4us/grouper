package dev.prometheus.grouping;


import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;

class UUIDGenerator {
    public static String generateUUID() {
        return String.valueOf(UUID.randomUUID());
    }
}
@Getter
@Setter
@Document(collection = "e#3_2")
public class Student {
    private String id = UUIDGenerator.generateUUID();
    private String name;

}
