package dev.prometheus.grouping.controller;

import dev.prometheus.grouping.service.GroupingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/grouping")
public class GroupingController {
    private final GroupingService groupingService;

    @Autowired
    public GroupingController(GroupingService groupingService) {
        this.groupingService = groupingService;
    }

    @GetMapping("/bySize")
    public ResponseEntity<List<List<String>>> generateGroupsBySize(
            @RequestParam(defaultValue = "3") int groupSize,
            @RequestParam(defaultValue = "false") boolean exclude) throws IOException {
        List<List<String>> groups = groupingService.createGroups(groupSize, exclude);
        return ResponseEntity.ok(groupingService.replaceIdsWithNames(groups));
    }

    @GetMapping("/byNumber")
    public ResponseEntity<List<List<String>>> generateGroupsByNumber(
            @RequestParam int numberOfGroups,
            @RequestParam(defaultValue = "false") boolean exclude) throws IOException {
        List<List<String>> groups = groupingService.createGroupsByNumber(numberOfGroups, exclude);
        return ResponseEntity.ok(groupingService.replaceIdsWithNames(groups));
    }

    @GetMapping("/exclude")
    public ResponseEntity<List<String>> getExcludedList() throws IOException {
        return ResponseEntity.ok(groupingService.readExcludeList());
    }

    @PutMapping("/exclude")
    public ResponseEntity<Void> updateExcludedList(@RequestBody List<String> ids) throws IOException {
        groupingService.writeExcludeList(ids);
        return ResponseEntity.noContent().build();
    }
}
