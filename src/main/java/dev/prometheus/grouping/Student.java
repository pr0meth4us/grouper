package dev.prometheus.grouping;


import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.UUID;


@Getter
@Setter
@Document(collection = "e#3_2")
public class Student {
    private UUID id = UUID.randomUUID();
    private String name;
}
