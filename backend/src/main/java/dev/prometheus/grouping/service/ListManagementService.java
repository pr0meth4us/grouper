package dev.prometheus.grouping.service;

import dev.prometheus.grouping.dto.ListRequest;
import dev.prometheus.grouping.dto.UserList;
import dev.prometheus.grouping.exception.EmptyListException;
import dev.prometheus.grouping.exception.ListNotFoundException;
import dev.prometheus.grouping.model.User;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@Slf4j
public class ListManagementService {

    public UserList createList(ListRequest request) {
        List<String> items = processListContent(request.getContent());
        UserList newList = new UserList();
        newList.setName(request.getName());
        newList.setItems(items);
        return newList;
    }

    public List<UserList> getAllLists(User user) {
        return user.getLists() != null ? user.getLists() : new ArrayList<>();
    }

    public List<String> getItemsWithExclusions(UserList userList, Set<String> exclusions) {
        List<String> items = new ArrayList<>(userList.getItems());
        items = ridItemsOfExclusions(items, exclusions);
        userList.shuffleItems();
        return items;
    }

    public List<String> ridItemsOfExclusions (List<String> items, Set<String> exclusions) {
        if (exclusions != null && !exclusions.isEmpty()) {
            items = items.stream()
                    .filter(item -> !exclusions.contains(item))
                    .collect(Collectors.toList());
        }
        if (items.isEmpty()) {
            throw new EmptyListException("List is empty after applying exclusions");
        }
        return items;
    }

    public void updateList(UserList list, ListRequest request) {
        List<String> items = processListContent(request.getContent());
        list.setName(request.getName());
        list.setItems(items);
    }

    public UserList findListOrThrow(User user, String listId) {
        if (user.getLists() == null) {
            throw new ListNotFoundException("List not found");
        }

        return user.getLists().stream()
                .filter(list -> list.getListId().equals(listId))
                .findFirst()
                .orElseThrow(() -> new ListNotFoundException("List not found"));
    }

    public List<String> processListContent(String content) {
        return content.lines()
                .map(String::trim)
                .filter(line -> !line.isEmpty())
                .collect(Collectors.toList());
    }
}

