package dev.prometheus.grouping.exclude;

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
@Document(collection = "exclude")
public class Exclude {
    private String id = UUIDGenerator.generateUUID();
    private String name;

    public Exclude() {
    }
    public String getId() {
        return id;
    }

    public String getName() {
        return name;
    }



    public void setId(String id) {
    }



    // Implement methods from Entity interface

}
