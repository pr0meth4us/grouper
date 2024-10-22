package dev.prometheus.grouping.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.UUID;

@Data
public class UserList {
    private String listId;
    private String name;
    private List<String> items;
    private LocalDateTime createdAt;

    public UserList() {
        this.listId = UUID.randomUUID().toString();
        this.items = new ArrayList<>();
        this.createdAt = LocalDateTime.now();
    }

    public void shuffleItems() {
        Collections.shuffle(this.items);
    }
}
