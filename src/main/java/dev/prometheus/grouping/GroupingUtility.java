package dev.prometheus.grouping;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RestController
@Setter
@Getter
public class GroupingUtility {
    private ArrayList<ArrayList<String>> classList;
    private static Repository repository;

    @Autowired
    public GroupingUtility(Repository repository) {
        this.repository = repository;
        this.classList = convertStudentListToStringList(repository.findAll());
    }

    private ArrayList<ArrayList<String>> convertStudentListToStringList(List<Student> students) {
        ArrayList<ArrayList<String>> classList = new ArrayList<>();
        for (Student student : students) {
            ArrayList<String> studentInfo = new ArrayList<>();
            studentInfo.add(student.getId());
            studentInfo.add(student.getName());
            classList.add(studentInfo);
        }
        return classList;
    }

    public ArrayList<ArrayList<String>> getShuffledList() {
        ArrayList<ArrayList<String>> shuffledArrayList = new ArrayList<>(classList);
        Collections.shuffle(shuffledArrayList);
        return shuffledArrayList;
    }


    public ArrayList<ArrayList<ArrayList<String>>> getGroupsByNumberOfGroups(int numberOfGroups) {
        ArrayList<ArrayList<ArrayList<String>>> groups = new ArrayList<>();
        ArrayList<ArrayList<String>> shuffledArrayList = getShuffledList();

        for (int i = 0; i < numberOfGroups; i++) {
            groups.add(new ArrayList<>());
        }

        for (ArrayList<String> studentInfo : shuffledArrayList) {
            for (int i = 0; i < numberOfGroups; i++) {
                groups.get(i).add(studentInfo);
            }
        }

        return groups;
    }

    public ArrayList<ArrayList<ArrayList<String>>> getGroupByGroupSize(int groupSize) {
        ArrayList<ArrayList<ArrayList<String>>> groups = new ArrayList<>();
        ArrayList<ArrayList<String>> shuffledArrayList = getShuffledList();

        for (int i = 0; i < shuffledArrayList.size(); i += groupSize) {
            ArrayList<ArrayList<String>> group = new ArrayList<>(
                    shuffledArrayList.subList(i, Math.min(i + groupSize, shuffledArrayList.size())));
            groups.add(group);
        }

        return groups;
    }

    public static boolean reshuffle(ArrayList<ArrayList<ArrayList<String>>> groups) {

        boolean reshuffle = true;
        for (ArrayList<ArrayList<String>> group : groups) {
            for (ArrayList<String> ids : group) {
                if (ids.contains("ee008eca-69c0-4033-a1a3-e9d3f7f66983")) {
                    for (ArrayList<String> ids2 : group) {
                        if (ids2.contains("122420b7-3336-4213-8112-45daebd6d7b4") && ids != ids2) {
                            reshuffle = false;
                            break;
                        }
                    }
                }
                if (ids.contains("a74a2535-f394-4861-8153-4ef1bf14499e")) {
                    for (ArrayList<String> ids2 : group) {
                        if (ids2.contains("87f80f9a-f623-4041-9f2c-6b2f0ce65bc6") && ids != ids2) {
                            reshuffle = false;
                            break;
                        }
                    }
                }
            }
        }
//        for (ArrayList<ArrayList<String>> group : groups) {
//            for (ArrayList<String> ids : group) {
//                if (ids.contains("a74a2535-f394-4861-8153-4ef1bf14499e")) {
//                    for (ArrayList<String> ids2 : group) {
//                        if (ids2.contains("87f80f9a-f623-4041-9f2c-6b2f0ce65bc6") && ids != ids2) {
//                            reshuffle = false;
//                            break;
//                        }
//                    }
//                }
//            }
//        }
        if (!reshuffle) {
            System.out.println(groups);
            return true;
        }
        return false;
    }

}
