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
        User user = getUserOrThrow(userEmail);

        List<String> items = processListContent(request.getContent());
        validateItems(items);

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
        User user = getUserOrThrow(userEmail);
        return user.getLists() != null ? user.getLists() : new ArrayList<>();
    }

    public UserList getList(String userEmail, String listId) {
        User user = getUserOrThrow(userEmail);
        return findListOrThrow(user, listId);
    }

    public List<List<String>> createGroupBySize(String userEmail, String listId, int size) {
        UserList userList = getList(userEmail, listId);
        List<String> items = userList.getItems();

        userList.shuffleItems();

        List<List<String>> groups = new ArrayList<>();
        for (int i = 0; i < items.size(); i += size) {
            groups.add(items.subList(i, Math.min(i + size, items.size())));
        }

        return groups;
    }

    public UserList updateList(String userEmail, String listId, ListRequest request) {
        User user = getUserOrThrow(userEmail);
        UserList listToUpdate = findListOrThrow(user, listId);

        List<String> items = processListContent(request.getContent());
        validateItems(items);

        listToUpdate.setName(request.getName());
        listToUpdate.setItems(items);

        userRepository.save(user);
        return listToUpdate;
    }

    public void deleteList(String userEmail, String listId) {
        User user = getUserOrThrow(userEmail);
        UserList list = findListOrThrow(user, listId);

        user.getLists().remove(list);
        userRepository.save(user);
    }

    private User getUserOrThrow(String userEmail) {
        User user = userRepository.findByEmail(userEmail);
        if (user == null) {
            throw new UserNotFoundException("User not found");
        }
        return user;
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

    private void validateItems(List<String> items) {
        if (items.isEmpty()) {
            throw new EmptyListException("List cannot be empty");
        }
    }
}

