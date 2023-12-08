package dev.prometheus.grouping.exclude;

import dev.prometheus.grouping.GroupingUtility;
import dev.prometheus.grouping.Repository;
import dev.prometheus.grouping.Student;
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

    @GetMapping("/exclude")
    public ModelAndView exclude() {
        List<Exclude> excludees = tempoRepo.findAll();
        ModelAndView modelAndView = new ModelAndView("exclude");
        modelAndView.addObject("excludees", excludees);
        return modelAndView;
    }
    @GetMapping("/favicon.ico")
    public String favicon() {
        return "";
    }

    @DeleteMapping(value = "/exclude/process", consumes = "application/json")
    public ResponseEntity<?> delete(@RequestBody List<String> ids) {

        for (String id : ids) {
            tempoRepo.deleteById(id);
        }
        return ResponseEntity.ok().build();
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
        ArrayList<ArrayList<String>> groups = new ArrayList<>();

        if (choiceInt == 1 && groupSize != null) {
            do {
                groups = groupingUtility.getGroupByGroupSize(groupSize);
            } while (ExclusionUtility.reshuffle(groups));
        } else if (choiceInt == 2 && numberOfGroups != null) {
            do {
                groups = groupingUtility.getGroupsByNumberOfGroups(numberOfGroups);
            } while (ExclusionUtility.reshuffle(groups));
        }

        ModelAndView modelAndView = new ModelAndView("groupwithexclusion");
        modelAndView.addObject("shuffledGroups", groups);
        modelAndView.addObject("choiceInt", choiceInt);
        modelAndView.addObject("groupSize", groupSize);
        modelAndView.addObject("numberOfGroups", numberOfGroups);
        return modelAndView;
    }
}
