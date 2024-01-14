package dev.prometheus.grouping.UI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

@RestController
public class Controller {
    private final GroupingUtility groupingUtility;
    private final Repository repository;

    @Autowired
    public Controller(Repository repository, GroupingUtility groupingUtility) {
        this.repository = repository;
        this.groupingUtility = groupingUtility;
    }

    @GetMapping("/")
    public ModelAndView homepage() {
        System.out.println(groupingUtility.createStudentList());

        return new ModelAndView("index");
    }


    @GetMapping("/list")
    public ModelAndView showList() {
        List<Student> students = repository.findAll();
        ModelAndView modelAndView = new ModelAndView("list");
        Collections.shuffle(students);
        modelAndView.addObject("students", students);

        return modelAndView;
    }

    @GetMapping("/list/{id}")
    public ResponseEntity<?> getStudentByID(@PathVariable("id") String id) {
        Optional<Student> student = repository.findById(id);
        if (student.isPresent()) {
            return new ResponseEntity<>(student.get(), HttpStatus.OK);
        } else {
            return new ResponseEntity<>("Person not found", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping("/list/delete/{id}")
    public ModelAndView deleteStudentByID(@PathVariable("id") String id) {
        Optional<Student> student = repository.findById(id);
        if (student.isPresent()) {
            repository.deleteById(id);
        }
        return new ModelAndView("redirect:/list");
    }

    @GetMapping("/list/add")
    public ModelAndView addStudentForm(@ModelAttribute("student") Student student) {
        return new ModelAndView("addform");
    }


    @PostMapping("/list")
    public ModelAndView saveStudent(@ModelAttribute("student") @RequestBody Student student) {
        if (repository.existsByName(student.getName())) {
            return new ModelAndView("redirect:/list?error=NameAlreadyExists");
        }
        repository.save(student);
        return new ModelAndView("redirect:/list");
    }

    @GetMapping("/addlist/form")
    public ModelAndView addListStudentForm() {

        return new ModelAndView("addlist");

    }

    @PostMapping("/addlist")
    public ModelAndView saveAllStudent(@RequestBody List<Student> NewStudents) {
        for (Student student : NewStudents) {
            if (!repository.existsByName(student.getName())) {
                repository.save(student);
            }
        }
        return new ModelAndView("/list");
    }



    @GetMapping("/list/edit/{id}")
    public ModelAndView editStudentForm(@PathVariable("id") String id) {
        Optional<Student> student = repository.findById(id);
        ModelAndView modelAndView = new ModelAndView("edit");
        modelAndView.addObject("student", student);
        return modelAndView;
    }

    @PostMapping("/list/{id}")
    public ModelAndView updateStudent(@PathVariable("id") String id, @ModelAttribute("student") Student student) {
        Student existingStudent = repository.findById(id).orElse(null);
        if (existingStudent != null) {
            existingStudent.setName(student.getName());
            repository.save(existingStudent);
        }

        return new ModelAndView("redirect:/list");
    }


    private ModelAndView getModelAndView(@RequestParam(name = "choice", defaultValue = "3") int choiceInt, @RequestParam(name = "groupSize", required = false) Integer groupSize, @RequestParam(name = "numberOfGroups", required = false) Integer numberOfGroups, boolean exclude) throws IOException {
        ArrayList<ArrayList<String>> idgroups = new ArrayList<>();

        if (choiceInt == 1 && groupSize != null) {
            do {
                idgroups = groupingUtility.getGroupByGroupSize(groupSize, exclude);
            } while (!GroupingUtility.reshuffle(idgroups));
        } else if (choiceInt == 2 && numberOfGroups != null) {
            do {
                idgroups = groupingUtility.getGroupsByNumberOfGroups(numberOfGroups, exclude);
            } while (!GroupingUtility.reshuffle(idgroups));
        }
        ArrayList<ArrayList<String>> groups = groupingUtility.replaceIdsWithNames(idgroups);

        ModelAndView modelAndView = new ModelAndView("group");
        modelAndView.addObject("exclude", exclude);
        modelAndView.addObject("shuffledGroups", groups);
        modelAndView.addObject("choiceInt", choiceInt);
        modelAndView.addObject("groupSize", groupSize);
        modelAndView.addObject("numberOfGroups", numberOfGroups);
        return modelAndView;
    }

    @GetMapping("/exclude")
    public ModelAndView exclude() {
        List<Student> excludees = repository.findAll();
        ModelAndView modelAndView = new ModelAndView("exclude");
        modelAndView.addObject("excludees", excludees);
        return modelAndView;
    }

    @CrossOrigin(origins = "*")
    @PostMapping(value = "/excluding", consumes = "application/json", produces = "application/json")
    public ResponseEntity<?> delete(@RequestBody List<String> ids) throws IOException {

        System.out.println(ids);
        if (groupingUtility.writeIdsToJsonFile(ids)) {
            return ResponseEntity.ok().build();
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to write to JSON file");
        }

    }

    @GetMapping("/group")
    public ModelAndView generateGroups(
            @RequestParam(name = "choice", defaultValue = "3") int choiceInt,
            @RequestParam(name = "groupSize", required = false) Integer groupSize,
            @RequestParam(name = "numberOfGroups", required = false) Integer numberOfGroups
    ) throws IOException {
        boolean exclude = false;

        return getModelAndView(choiceInt, groupSize, numberOfGroups, exclude);
    }


    @GetMapping("/groupwithexclusion")
    public ModelAndView generateGroupsz(
            @RequestParam(name = "choice", defaultValue = "3") int choiceInt,
            @RequestParam(name = "groupSize", required = false) Integer groupSize,
            @RequestParam(name = "numberOfGroups", required = false) Integer numberOfGroups
    ) throws IOException {
        boolean exclude = true;

        return getModelAndView(choiceInt, groupSize, numberOfGroups, exclude);
    }

}