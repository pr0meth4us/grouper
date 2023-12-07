package dev.prometheus.grouping.admin;

import dev.prometheus.grouping.Repository;
import dev.prometheus.grouping.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Controller
@RequestMapping("/admin")
public class AdminController {

    @Autowired
    private Repository studentRepository;

    @GetMapping
    public ModelAndView showAll() {
        List<Student> students = studentRepository.findAll();
        ModelAndView modelAndView = new ModelAndView("showAll"); // Specify the view name (showAll.html) without extension
        modelAndView.addObject("students", students);
        return modelAndView;
    }
    @GetMapping("/update/{id}")
    public ModelAndView showUpdateForm(@PathVariable String id) {
        Student student = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id " + id));

        ModelAndView modelAndView = new ModelAndView("updateForm"); // Specify the view name (updateForm.html) without extension
        modelAndView.addObject("student", student);
        return modelAndView;
    }

    @PostMapping("/update/{id}")
    public ModelAndView updateStudent(@PathVariable String id, @ModelAttribute("student") Student updatedStudent) {
        Student existingStudent = studentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Student not found with id " + id));
        studentRepository.delete(existingStudent);

        existingStudent.setId(updatedStudent.getId());
        existingStudent.setName(updatedStudent.getName());

        studentRepository.save(existingStudent);

        ModelAndView modelAndView = new ModelAndView("updateSuccess"); // Specify the view name (updateSuccess.html) without extension
        return modelAndView;
    }


    @GetMapping("/{name}")
    public ModelAndView getStudentByName(@PathVariable("name") String name) {
        name = name.toLowerCase().replaceAll("\\s", "");
        Student student = studentRepository.findByName(name);
        ModelAndView modelAndView;
        if (student != null) {
            modelAndView = new ModelAndView("showStudent"); // Specify the view name (showStudent.html) without extension
            modelAndView.addObject("student", student);
        } else {
            modelAndView = new ModelAndView("error"); // Specify the view name for error handling
            modelAndView.addObject("errorMessage", "Student not found with name: " + name);
        }
        return modelAndView;
    }

    @PutMapping("/{name}")
    public ModelAndView updateStudentbname(@PathVariable("name") String name, @ModelAttribute("student") Student studentDetails) {
        Student student = studentRepository.findByName(name);
        if (student != null) {
            student.setName(name.toLowerCase().replaceAll("\\s", ""));
            studentRepository.save(student);
            ModelAndView modelAndView = new ModelAndView("updateSuccess"); // Specify the view name (updateSuccess.html) without extension
            return modelAndView;
        } else {
            ModelAndView modelAndView = new ModelAndView("error"); // Specify the view name for error handling
            modelAndView.addObject("errorMessage", "Student not found with name: " + name);
            return modelAndView;
        }
    }


    @ExceptionHandler(Exception.class)
    public ModelAndView handleException(Exception e) {
        ModelAndView modelAndView = new ModelAndView("error"); // Specify the view name for error handling
        modelAndView.addObject("errorMessage", "An error occurred: " + e.getMessage());
        return modelAndView;
    }
    @GetMapping("/list/addlist")
    public ModelAndView addStudentListForm() {
        return new ModelAndView("addlist");
    }
    @PostMapping("/list/save")
    public ModelAndView saveStudents(@RequestParam("studentList") String studentList) {
        List<Student> students = Arrays.stream(studentList.split("\\r?\\n"))
                .map(name -> new Student(name))
                .collect(Collectors.toList());

        studentRepository.saveAll(students);

        return new ModelAndView("redirect:/list");
    }
}
