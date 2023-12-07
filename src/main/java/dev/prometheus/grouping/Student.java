package dev.prometheus.grouping;


import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.*;

class RandomUUID {
    public static String generateUUID() {
        return UUID.randomUUID().toString();
    }
}
@Getter
@Setter
@Document(collection = "e#3_2")
public class Student {
    private String id = RandomUUID.generateUUID();
    private String name;


    public Student(String name) {
    }
}
