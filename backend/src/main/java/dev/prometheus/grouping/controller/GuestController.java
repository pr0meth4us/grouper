package dev.prometheus.grouping.controller;

import com.fasterxml.jackson.databind.JsonNode;
import dev.prometheus.grouping.dto.ApiResponse;
import dev.prometheus.grouping.service.GroupingService;
import dev.prometheus.grouping.service.ListManagementService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
@RequestMapping("/guest")
public class GuestController {
    private final GroupingService groupingService;
    private final ListManagementService listManagementService;

    public GuestController(GroupingService groupingService, ListManagementService listManagementService) {
        this.groupingService = groupingService;
        this.listManagementService = listManagementService;
    }
    @PostMapping("/get-list")
    public List<String> getList(@RequestBody JsonNode json, HttpServletRequest request){
        String content = json.get("content").asText();
        List<String> processedList = listManagementService.processListContent(content);
        request.getSession().setAttribute("list", processedList);
        return processedList;
    }

    @GetMapping("/get-session-list")
    public List<String> getSessionList(HttpServletRequest request) {
        Object sessionList = request.getSession().getAttribute("list");
        return (List<String>) sessionList;
    }


    @GetMapping("/grouping")
    public ResponseEntity<ApiResponse> grouping(
            HttpServletRequest request,
            @RequestParam(required = false) Integer size,
            @RequestParam(required = false) Integer number,
            @RequestParam(required = false) List<String> exclude
    ){
        Object sessionList = request.getSession().getAttribute("list");

        if (!(sessionList instanceof List<?>)) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, "No valid list found from previous step", null));
        }

        @SuppressWarnings("unchecked")
        List<String> content = (List<String>) sessionList;
        List<String> shuffled = new ArrayList<>(content);
        Collections.shuffle(shuffled);

        Set<String> exclusion = exclude != null ? new HashSet<>(exclude) : null;
        List<String> itemsToGroup = listManagementService.ridItemsOfExclusions(shuffled, exclusion);
        List<List<String>> groupedLists;
        if (size != null) {
            groupedLists =  groupingService.groupBySize(itemsToGroup, size);
        } else if (number != null) {
            groupedLists = groupingService.groupBySize(itemsToGroup, number);
        } else {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Either 'size' or 'number' parameter must be provided", null));
        }

        ApiResponse response = new ApiResponse(true, "Grouping successful", groupedLists);
        return ResponseEntity.ok(response);
    }
}

