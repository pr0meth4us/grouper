package dev.prometheus.grouping.service;

import dev.prometheus.grouping.dto.ListRequest;
import dev.prometheus.grouping.exception.EmptyListException;
import dev.prometheus.grouping.exception.ListNotFoundException;
import dev.prometheus.grouping.exception.UserNotFoundException;
import dev.prometheus.grouping.model.User;
import dev.prometheus.grouping.dto.UserList;
import dev.prometheus.grouping.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Service
@Slf4j
public class ListService {
    private final UserRepository userRepository;
    private final ListManagementService listManagementService;
    private final GroupingService groupingService;

    public ListService(
            UserRepository userRepository,
            ListManagementService listManagementService,
            GroupingService groupingService) {
        this.userRepository = userRepository;
        this.listManagementService = listManagementService;
        this.groupingService = groupingService;
    }

    public UserList addList(String userEmail, ListRequest request) {
        User user = userRepository.findByEmail(userEmail);
        UserList newList = listManagementService.createList(request);

        if (user.getLists() == null) {
            user.setLists(new ArrayList<>());
        }
        user.getLists().add(newList);

        userRepository.save(user);
        return newList;
    }

    public List<UserList> getAllLists(String userEmail) {
        User user = userRepository.findByEmail(userEmail);
        return listManagementService.getAllLists(user);
    }

    public UserList getList(String userEmail, String listId) {
        User user = userRepository.findByEmail(userEmail);
        return listManagementService.findListOrThrow(user, listId);
    }

    public List<List<String>> createGroupBySize(String userEmail, String listId, int size, Set<String> exclusions) {
        List<String> items = getItemsWithExclusions(userEmail, listId, exclusions);
        return groupingService.groupBySize(items, size);
    }

    public List<List<String>> createGroupByNumber(String userEmail, String listId, int number, Set<String> exclusions) {
        List<String> items = getItemsWithExclusions(userEmail, listId, exclusions);
        return groupingService.groupByNumber(items, number);
    }

    public List<String> getItemsWithExclusions(String userEmail, String listId, Set<String> exclusions) {
        UserList userList = getList(userEmail, listId);
        return listManagementService.getItemsWithExclusions(userList, exclusions);
    }

    public UserList updateList(String userEmail, String listId, ListRequest request) {
        User user = userRepository.findByEmail(userEmail);
        UserList listToUpdate = listManagementService.findListOrThrow(user, listId);
        listManagementService.updateList(listToUpdate, request);
        userRepository.save(user);
        return listToUpdate;
    }

    public void deleteList(String userEmail, String listId) {
        User user = userRepository.findByEmail(userEmail);
        UserList list = listManagementService.findListOrThrow(user, listId);
        user.getLists().remove(list);
        userRepository.save(user);
    }

    public UserList editItem(String userEmail, String listId, int itemIndex, String newItem)
            throws UserNotFoundException, ListNotFoundException, EmptyListException {
        UserList userList = getList(userEmail, listId);

        if (itemIndex < 0 || itemIndex >= userList.getItems().size()) {
            throw new IndexOutOfBoundsException("Invalid item index");
        }

        List<String> items = new ArrayList<>(userList.getItems());
        items.set(itemIndex, newItem);

        ListRequest listRequest = new ListRequest();
        listRequest.setName(userList.getName());
        listRequest.setContent(String.join("\n", items));

        User user = userRepository.findByEmail(userEmail);
        listManagementService.updateList(userList, listRequest);
        userRepository.save(user);

        return userList;
    }
    public UserList deleteItem(String userEmail, String listId, int itemIndex
    ) throws UserNotFoundException, ListNotFoundException, EmptyListException {
        UserList userList = getList(userEmail, listId);
        if (itemIndex < 0 || itemIndex >= userList.getItems().size()) {
            throw new IndexOutOfBoundsException("Invalid item index");
        }
        userList.getItems().remove(itemIndex);
        User user = userRepository.findByEmail(userEmail);
        listManagementService.updateList(userList, new ListRequest());
        userRepository.save(user);
        return userList;
    }

}
