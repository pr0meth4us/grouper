package dev.prometheus.grouping.exclude;


import dev.prometheus.grouping.UI.Repository;
import dev.prometheus.grouping.UI.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.ArrayList;
import java.util.List;

@RestController
public class ExcludeController {
    private final TempoRepo tempoRepo;
    private ExclusionUtility groupingUtility;

    @Autowired
    public ExcludeController(TempoRepo tempoRepo, Repository repository, ExclusionUtility groupingUtility) {
        this.tempoRepo = tempoRepo;
        this.groupingUtility = groupingUtility;
        tempoRepo.deleteAll();
        List<Student> students = repository.findAll();
        List<Exclude> excludes = new ArrayList<>(); // Initialize the list
        for (Student student : students) {
            Exclude exclude = new Exclude();
            exclude.setName(student.getName());
            excludes.add(exclude);
        }
        tempoRepo.saveAll(excludes);
    }
    @GetMapping("/favicon.ico")
    public String favicon() {
        return "";
    }




    @GetMapping("/exclude/list")
    public ModelAndView showList() {
        return new ModelAndView("redirect:/groupwithexclusion");
    }

    @GetMapping("/groupwithexclusion")
    public ModelAndView generateGroups(
            @RequestParam(name = "choice", defaultValue = "3") int choiceInt,
            @RequestParam(name = "groupSize", required = false) Integer groupSize,
            @RequestParam(name = "numberOfGroups", required = false) Integer numberOfGroups
    ) {
        ArrayList<ArrayList<String>> idgroups = new ArrayList<>();

        if (choiceInt == 1 && groupSize != null) {
            do {
                idgroups = groupingUtility.getGroupByGroupSize(groupSize);
            } while (ExclusionUtility.reshuffle(idgroups));
        } else if (choiceInt == 2 && numberOfGroups != null) {
            do {
                idgroups = groupingUtility.getGroupsByNumberOfGroups(numberOfGroups);
            } while (ExclusionUtility.reshuffle(idgroups));
        }
        ArrayList<ArrayList<String>> groups = ExclusionUtility.replaceIdsWithNames(idgroups);
        ModelAndView modelAndView = new ModelAndView("groupwithexclusion");
        modelAndView.addObject("shuffledGroups", groups);
        modelAndView.addObject("choiceInt", choiceInt);
        modelAndView.addObject("groupSize", groupSize);
        modelAndView.addObject("numberOfGroups", numberOfGroups);
        return modelAndView;
    }
}
