package dev.prometheus.grouping.service;

import dev.prometheus.grouping.dto.ListRequest;
import dev.prometheus.grouping.model.User;
import dev.prometheus.grouping.exception.*;
import dev.prometheus.grouping.dto.UserList;
import dev.prometheus.grouping.repository.UserRepository;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ListService {
    private final UserRepository userRepository;
    private final GroupingService groupingService;

    public ListService(UserRepository userRepository, GroupingService groupingService) {
        this.userRepository = userRepository;
        this.groupingService = groupingService;
    }

    public UserList addList(String userEmail, ListRequest request) {
        User user = userRepository.findByEmail(userEmail);

        List<String> items = processListContent(request.getContent());

        UserList newList = new UserList();
        newList.setName(request.getName());
        newList.setItems(items);

        if (user.getLists() == null) {
            user.setLists(new ArrayList<>());
        }
        user.getLists().add(newList);

        userRepository.save(user);
        return newList;
    }

    public List<UserList> getAllLists(String userEmail) {
        User user = userRepository.findByEmail(userEmail);
        return user.getLists() != null ? user.getLists() : new ArrayList<>();
    }

    public UserList getList(String userEmail, String listId) {
        User user = userRepository.findByEmail(userEmail);
        return findListOrThrow(user, listId);
    }

    public List<String> getItems(String userEmail, String listId) {
        UserList userList = getList(userEmail, listId);
        userList.shuffleItems();
       return userList.getItems();
    }

    public List<List<String>> groupBySize (List<String> items, int size) {
        List<List<String>> groups = new ArrayList<>();
        for (int i = 0; i < items.size(); i += size) {
            groups.add(items.subList(i, Math.min(i + size, items.size())));
        }
        return groups;
    }

    public List<List<String>> groupByNumber (List<String> items, int number) {
        List<List<String>> groups = new ArrayList<>();
        int totalItems = items.size();

        if (number <= 0 || totalItems == 0) {
            return groups;
        }

        int groupSize = totalItems / number;
        int remaining = totalItems % number;

        int startIndex = 0;
        for (int i = 0; i < number; i++) {
            int endIndex = startIndex + groupSize + (remaining > 0 ? 1 : 0);
            groups.add(items.subList(startIndex, Math.min(endIndex, totalItems)));
            startIndex = endIndex;
            remaining--;
        }

        return groups;
    }

    public List<List<String>> createGroupBySize(String userEmail, String listId, int size) {
        List<String> items = getItems(userEmail, listId);
        return groupBySize(items, size);
    }

    public List<List<String>> createGroupByNumber(String userEmail, String listId, int number) {
        List<String> items = getItems(userEmail, listId);
        return groupByNumber(items, number);
    }

    public UserList updateList(String userEmail, String listId, ListRequest request) {
        User user = userRepository.findByEmail(userEmail);
        UserList listToUpdate = findListOrThrow(user, listId);

        List<String> items = processListContent(request.getContent());

        listToUpdate.setName(request.getName());
        listToUpdate.setItems(items);

        userRepository.save(user);
        return listToUpdate;
    }

    public void deleteList(String userEmail, String listId) {
        User user = userRepository.findByEmail(userEmail);
        UserList list = findListOrThrow(user, listId);

        user.getLists().remove(list);
        userRepository.save(user);
    }

    private UserList findListOrThrow(User user, String listId) {
        if (user.getLists() == null) {
            throw new ListNotFoundException("List not found");
        }

        return user.getLists().stream()
                .filter(list -> list.getListId().equals(listId))
                .findFirst()
                .orElseThrow(() -> new ListNotFoundException("List not found"));
    }

    private List<String> processListContent(String content) {
        return content.lines()
                .map(String::trim)
                .filter(line -> !line.isEmpty())
                .collect(Collectors.toList());
    }

}

