package dev.prometheus.grouping.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import java.util.*;

@Service
@Slf4j
public class GroupingService {

    public List<List<String>> groupBySize(List<String> items, int size) {
        List<List<String>> groups = new ArrayList<>();
        for (int i = 0; i < items.size(); i += size) {
            groups.add(items.subList(i, Math.min(i + size, items.size())));
        }
        return groups;
    }

    public List<List<String>> groupByNumber(List<String> items, int number) {
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

}