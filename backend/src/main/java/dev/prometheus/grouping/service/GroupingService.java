package dev.prometheus.grouping.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.prometheus.grouping.model.Student;
import dev.prometheus.grouping.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class GroupingService {
    private final StudentRepository studentRepository;
    private final ObjectMapper objectMapper;
    private static final Path EXCLUDE_FILE_PATH = Paths.get("./src/main/resources/static/json/exclude.json");

    @Autowired
    public GroupingService(StudentRepository studentRepository, ObjectMapper objectMapper) {
        this.studentRepository = studentRepository;
        this.objectMapper = objectMapper;
    }

    public List<List<String>> createGroups(int groupSize, boolean exclude) throws IOException {
        List<String> shuffledIds = getShuffledList(exclude);
        return partitionList(shuffledIds, groupSize);
    }

    public List<List<String>> createGroupsByNumber(int numberOfGroups, boolean exclude) throws IOException {
        List<String> shuffledIds = getShuffledList(exclude);
        return partitionListByNumber(shuffledIds, numberOfGroups);
    }

    private List<String> getShuffledList(boolean exclude) throws IOException {
        List<String> ids = studentRepository.findAll().stream().map(Student::getId).collect(Collectors.toList());
        if (exclude) {
            List<String> excludeList = readExcludeList();
            ids.removeAll(excludeList);
        }
        Collections.shuffle(ids);
        return ids;
    }

    private List<List<String>> partitionList(List<String> list, int partitionSize) {
        return new ArrayList<>(list.stream()
                .collect(Collectors.groupingBy(i -> list.indexOf(i) / partitionSize))
                .values());
    }

    private List<List<String>> partitionListByNumber(List<String> list, int numberOfGroups) {
        int size = list.size();
        int partitionSize = size / numberOfGroups;
        int remainder = size % numberOfGroups;

        List<List<String>> result = new ArrayList<>(numberOfGroups);
        int start = 0;
        for (int i = 0; i < numberOfGroups; i++) {
            int end = start + partitionSize + (i < remainder ? 1 : 0);
            result.add(new ArrayList<>(list.subList(start, end)));
            start = end;
        }
        return result;
    }

    public void writeExcludeList(List<String> ids) throws IOException {
        objectMapper.writeValue(EXCLUDE_FILE_PATH.toFile(), ids);
    }

    public List<String> readExcludeList() throws IOException {
        if (Files.exists(EXCLUDE_FILE_PATH)) {
            return objectMapper.readValue(EXCLUDE_FILE_PATH.toFile(), List.class);
        }
        return Collections.emptyList();
    }

    public List<List<String>> replaceIdsWithNames(List<List<String>> groups) {
        Map<String, String> idToNameMap = studentRepository.findAll().stream()
                .collect(Collectors.toMap(Student::getId, Student::getName));

        return groups.stream()
                .map(group -> group.stream()
                        .map(id -> idToNameMap.getOrDefault(id, id))
                        .collect(Collectors.toList()))
                .collect(Collectors.toList());
    }
}
