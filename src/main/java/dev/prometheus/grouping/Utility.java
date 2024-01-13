package dev.prometheus.grouping;

import dev.prometheus.grouping.UI.Repository;
import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Setter
@Getter
public abstract class Utility<T> {
    protected List<String> nameList;
    protected List<String> idList;
    protected ArrayList<ArrayList<String>> studentInfo;
    protected static Repository repository;

    public Utility(Repository repository) {
        Utility.repository = repository;
        this.nameList = convertStudentListToNameList((List<T>) repository.findAll());
        this.idList = convertStudentListToIdList((List<T>) repository.findAll());
        this.studentInfo = createStudentList();
    }

    protected abstract List<String> convertStudentListToIdList(List<T> students);

    protected abstract List<String> convertStudentListToNameList(List<T> students);

    protected ArrayList<ArrayList<String>> createStudentList() {
        ArrayList<ArrayList<String>> students = new ArrayList<>();
        for (int i = 0; i < nameList.size(); i++) {
            String name = nameList.get(i);
            String id = idList.get(i);

            ArrayList<String> studentInfo = new ArrayList<>();
            studentInfo.add(id);
            studentInfo.add(name);

            students.add(studentInfo);
        }
        return students;
    }

    protected ArrayList<String> getShuffledList() {
        ArrayList<String> shuffledArrayList = new ArrayList<>(idList);
        Collections.shuffle(shuffledArrayList);
        return shuffledArrayList;
    }

    public ArrayList<ArrayList<String>> getGroupsByNumberOfGroups(int numberOfGroups) {
        ArrayList<ArrayList<String>> groups = new ArrayList<>();
        ArrayList<String> shuffleList = new ArrayList<>(getShuffledList());

        for (int i = 0; i < numberOfGroups; i++) {
            groups.add(new ArrayList<>());
        }

        for (int i = 0; i < shuffleList.size(); i++) {
            groups.get(i % numberOfGroups).add(shuffleList.get(i));
        }
        return groups;
    }

    public ArrayList<ArrayList<String>> getGroupByGroupSize(int groupSize) {
        ArrayList<ArrayList<String>> groups = new ArrayList<>();
        ArrayList<String> shuffleList = new ArrayList<>(getShuffledList());

        int remainder = shuffleList.size() % groupSize;

        if (remainder == 0) {
            for (int i = 0; i < shuffleList.size(); i += groupSize) {
                groups.add(new ArrayList<>(shuffleList.subList(i, i + groupSize)));
            }
        } else {
            if (remainder > groupSize / 2) {
                for (int i = 0; i < shuffleList.size() - remainder; i += groupSize) {
                    groups.add(new ArrayList<>(shuffleList.subList(i, i + groupSize)));
                }
                groups.add(new ArrayList<>(shuffleList.subList(shuffleList.size() - remainder, shuffleList.size())));
            } else {
                for (int i = 0; i < shuffleList.size() - remainder; i += groupSize) {
                    groups.add(new ArrayList<>(shuffleList.subList(i, i + groupSize)));
                }
                for (int i = shuffleList.size() - remainder; i < shuffleList.size(); i++) {
                    groups.get(i - (shuffleList.size() - remainder)).add(shuffleList.get(i));
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
        boolean reshuffle = false;
        System.out.println(groups);
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
