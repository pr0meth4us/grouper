package dev.prometheus.grouping.controller;

import dev.prometheus.grouping.annotation.RequireAuth;
import dev.prometheus.grouping.dto.ApiResponse;
import dev.prometheus.grouping.dto.ListRequest;
import dev.prometheus.grouping.dto.UserList;
import dev.prometheus.grouping.exception.EmptyListException;
import dev.prometheus.grouping.exception.ListNotFoundException;
import dev.prometheus.grouping.exception.UserNotFoundException;
import dev.prometheus.grouping.service.ListService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lists")
public class ListController {
    private final ListService listService;

    public ListController(ListService listService) {
        this.listService = listService;
    }

    @RequireAuth
    @PostMapping("/add")
    public ResponseEntity<ApiResponse> addList(
            @RequestBody ListRequest request,
            HttpServletRequest httpRequest) {
        try {
            String userEmail = (String) httpRequest.getAttribute("userEmail");
            UserList newList = listService.addList(userEmail, request);
            return ResponseEntity.ok(new ApiResponse(true, "List added successfully", newList));
        } catch (UserNotFoundException | EmptyListException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse(false, "Error adding list: " + e.getMessage(), null));
        }
    }

    @RequireAuth
    @GetMapping
    public ResponseEntity<ApiResponse> getLists(HttpServletRequest request) {
        try {
            String userEmail = (String) request.getAttribute("userEmail");
            List<UserList> lists = listService.getAllLists(userEmail);
            return ResponseEntity.ok(new ApiResponse(true, "Lists retrieved successfully", lists));
        } catch (UserNotFoundException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage(), null));
        }
    }

    @RequireAuth
    @GetMapping("/{listId}")
    public ResponseEntity<ApiResponse> getList(
            @PathVariable String listId,
            HttpServletRequest request) {
        try {
            String userEmail = (String) request.getAttribute("userEmail");
            UserList list = listService.getList(userEmail, listId);
            return ResponseEntity.ok(new ApiResponse(true, "List retrieved successfully", list));
        } catch (UserNotFoundException | ListNotFoundException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage(), null));
        }
    }

    @RequireAuth
    @PutMapping("/{listId}")
    public ResponseEntity<ApiResponse> updateList(
            @PathVariable String listId,
            @RequestBody ListRequest request,
            HttpServletRequest httpRequest) {
        try {
            String userEmail = (String) httpRequest.getAttribute("userEmail");
            UserList updatedList = listService.updateList(userEmail, listId, request);
            return ResponseEntity.ok(new ApiResponse(true, "List updated successfully", updatedList));
        } catch (UserNotFoundException | ListNotFoundException | EmptyListException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse(false, "Error updating list: " + e.getMessage(), null));
        }
    }

    @RequireAuth
    @GetMapping("/{listId}/group")
    public ResponseEntity<ApiResponse> groupListBySize(
            @PathVariable String listId,
            @RequestParam int size,
            HttpServletRequest request) {
        try {
            String userEmail = (String) request.getAttribute("userEmail");
            List<List<String>> groupedLists = listService.createGroupBySize(userEmail, listId, size);
            return ResponseEntity.ok(new ApiResponse(true, "List grouped successfully", groupedLists));
        } catch (UserNotFoundException | ListNotFoundException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage(), null));
        } catch (Exception e) {
            return ResponseEntity.internalServerError()
                    .body(new ApiResponse(false, "Error grouping list: " + e.getMessage(), null));
        }
    }

    @RequireAuth
    @DeleteMapping("/{listId}")
    public ResponseEntity<ApiResponse> deleteList(
            @PathVariable String listId,
            HttpServletRequest request) {
        try {
            String userEmail = (String) request.getAttribute("userEmail");
            listService.deleteList(userEmail, listId);
            return ResponseEntity.ok(new ApiResponse(true, "List deleted successfully", null));
        } catch (UserNotFoundException | ListNotFoundException e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, e.getMessage(), null));
        }
    }
}
