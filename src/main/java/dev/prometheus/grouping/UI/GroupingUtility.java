package dev.prometheus.grouping.UI;
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
    private List<String> NameList;
    private List<String> IdList;
    private ArrayList<ArrayList<String>> studentInfo;
    private static Repository repository;

    @Autowired
    public GroupingUtility(Repository repository) {
        this.repository = repository;
        this.NameList = convertStudentListToNameList(repository.findAll());
        this.IdList = convertStudentListToIdList(repository.findAll());
        this.studentInfo = createStudentList();
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






    public ArrayList<String> getShuffledList() {
        ArrayList<String> shuffledArrayList = new ArrayList<>(IdList);
        Collections.shuffle(shuffledArrayList);
        return shuffledArrayList;
    }


    public ArrayList<ArrayList<String>> getGroupsByNumberOfGroups(int numberOfGroups) {
        ArrayList<ArrayList<String>> groups = new ArrayList<>();
        ArrayList<String> ShuffleList = new ArrayList<>(getShuffledList());

        for (int i = 0; i < numberOfGroups; i++) {
            groups.add(new ArrayList<>());
        }

        for (int i = 0; i < ShuffleList.size(); i++) {
            groups.get(i % numberOfGroups).add(ShuffleList.get(i));
        }

        return replaceIdsWithNames(groups);
    }

    public ArrayList<ArrayList<String>> getGroupByGroupSize(int groupSize) {
        ArrayList<ArrayList<String>> groups = new ArrayList<>();
        ArrayList<String> ShuffleList = new ArrayList<>(getShuffledList());

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
        System.out.println("1" +groups);
        ArrayList<ArrayList<String>> NameList = replaceIdsWithNames(groups);
        System.out.println(NameList);

        return NameList;
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
        boolean reshuffle = false;
        for (ArrayList<String> group : groups) {
            boolean conflict1 = group.contains("kittie") && group.contains("dogie");
            boolean conflict2 = group.contains("kittie") && group.contains("noodle");
            if (conflict1 || conflict2) {
                reshuffle = true;
                break;
            }
        }

        return reshuffle;
    }
}
