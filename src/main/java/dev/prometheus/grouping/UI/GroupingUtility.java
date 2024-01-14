package dev.prometheus.grouping.UI;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.gson.Gson;
import lombok.Getter;
import lombok.Setter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import java.io.*;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;

@RestController
@Setter
@Getter
public class GroupingUtility {
    private List<String> NameList;
    private List<String> IdList;
    private ArrayList<ArrayList<String>> studentInfo;
    private static Repository repository;
    private static final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    public GroupingUtility(Repository repository) {
        GroupingUtility.repository = repository;
        this.NameList = convertStudentListToNameList(repository.findAll());
        this.IdList = convertStudentListToIdList(repository.findAll());
        this.studentInfo = createStudentList();
    }

    private List<String> excludeList() throws IOException {
        List<String> excludeList;
        try {
            excludeList = readIdsFromJsonFile("./src/main/resources/static/json/exclude.json");
        } catch (IOException e) {
            e.printStackTrace();
            throw e; // Handle or rethrow the exception based on your requirements
        }

        List<String> updatedIdList = new ArrayList<>(IdList);
        assert excludeList != null;
        updatedIdList.removeAll(excludeList);
        return updatedIdList;
    }



    private List<String> convertStudentListToIdList(List<Student> students) {
        List<String> idList = new ArrayList<>();
        for (Student student : students) {
            idList.add(student.getId());
        }
        return idList;
    }
    private List<String> convertStudentListToNameList(List<Student> students) {
        List<String> nameList = new ArrayList<>();
        for (Student student : students) {
            nameList.add(student.getName());
        }
        return nameList;
    }

    public ArrayList<ArrayList<String>> createStudentList() {
        ArrayList<ArrayList<String>> students = new ArrayList<>();
        for (int i = 0; i < NameList.size(); i++) {
            String name = NameList.get(i);
            String id = IdList.get(i);

            ArrayList<String> studentInfo = new ArrayList<>();
            studentInfo.add(id);
            studentInfo.add(name);

            students.add(studentInfo);
        }
        return students;
    }


    public ArrayList<String> getShuffledList(boolean exclude) throws IOException {
        ArrayList<String> shuffledArrayList;
        if (exclude) {
            shuffledArrayList = new ArrayList<>(excludeList());
        } else {
            shuffledArrayList = new ArrayList<>(IdList);
        }
        Collections.shuffle(shuffledArrayList);
        return shuffledArrayList;
    }


    public ArrayList<ArrayList<String>> getGroupsByNumberOfGroups(int numberOfGroups, boolean exclude) throws IOException {
        ArrayList<ArrayList<String>> groups = new ArrayList<>();
        ArrayList<String> ShuffleList = new ArrayList<>(getShuffledList(exclude));

        for (int i = 0; i < numberOfGroups; i++) {
            groups.add(new ArrayList<>());
        }

        for (int i = 0; i < ShuffleList.size(); i++) {
            groups.get(i % numberOfGroups).add(ShuffleList.get(i));
        }
        return groups;
    }

    public ArrayList<ArrayList<String>> getGroupByGroupSize(int groupSize, boolean exclude) throws IOException {
        ArrayList<ArrayList<String>> groups = new ArrayList<>();
        ArrayList<String> ShuffleList = new ArrayList<>(getShuffledList(exclude));

        int remainder = ShuffleList.size() % groupSize;

        if (remainder == 0){
            for (int i = 0; i < ShuffleList.size(); i += groupSize) {
                groups.add(new ArrayList<>(ShuffleList.subList(i, i + groupSize)));
            }
        } else {
            if (remainder > groupSize/2){
                for (int i = 0; i < ShuffleList.size() - remainder; i += groupSize) {
                    groups.add(new ArrayList<>(ShuffleList.subList(i, i + groupSize)));
                }
                groups.add(new ArrayList<>(ShuffleList.subList(ShuffleList.size() - remainder, ShuffleList.size())));
            } else {
                for (int i = 0; i < ShuffleList.size() - remainder; i += groupSize) {
                    groups.add(new ArrayList<>(ShuffleList.subList(i, i + groupSize)));
                }
                for (int i = ShuffleList.size() - remainder; i < ShuffleList.size(); i++) {
                    groups.get(i - (ShuffleList.size() - remainder)).add(ShuffleList.get(i));
                }
            }

        }

        return groups;
    }
    public ArrayList<ArrayList<String>> replaceIdsWithNames(ArrayList<ArrayList<String>> groups) {
        ArrayList<ArrayList<String>> modifiedGroups = new ArrayList<>();

        for (ArrayList<String> ids : groups) {
            ArrayList<String> modifiedIds = new ArrayList<>();

            for (String id : ids) {
                boolean found = false;

                for (ArrayList<String> info : studentInfo) {
                    if (id.equals(info.get(0))) {
                        modifiedIds.add(info.get(1));
                        found = true;
                        break;
                    }
                }

                if (!found) {
                    modifiedIds.add(id);
                }
            }

            modifiedGroups.add(modifiedIds);
        }

        return modifiedGroups;
    }



    public static boolean reshuffle(ArrayList<ArrayList<String>> groups) {
        boolean reshuffle = true;
//        for (ArrayList<String> group : groups) {
//            boolean conflict1 = group.contains("kittie") && group.contains("doge");
//            boolean conflict2 = group.contains("kittie") && group.contains("noodle");
//            if (conflict1 || conflict2) {
//                reshuffle = false;
//                break;
//            }
//        }

        return reshuffle;
    }

    public boolean writeIdsToJsonFile(List<String> ids) throws IOException {
        try (BufferedWriter writer = new BufferedWriter(new FileWriter("./src/main/resources/static/json/exclude.json"))) {
            Gson gson = new Gson();
            gson.toJson(ids, writer);
            System.out.println("JSON data written to file successfully.");
            return true;
        } catch (IOException e) {
            System.err.println("Error writing JSON data to file: " + e.getMessage());
            throw e;
        }
    }
    public static List<String> readIdsFromJsonFile(String filePath) throws IOException {
        try (BufferedReader reader = new BufferedReader(new FileReader(filePath))) {
            Gson gson = new Gson();
            String jsonString = reader.readLine();
            if (jsonString != null && !jsonString.isEmpty()) {
                return Arrays.asList(gson.fromJson(jsonString, String[].class));
            } else {
                System.out.println("JSON file is empty.");
                return null;
            }
        } catch (IOException e) {
            System.err.println("Error reading JSON data from file: " + e.getMessage());
            throw e;
        }
    }


}