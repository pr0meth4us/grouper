package dev.prometheus.grouping.admin;

import dev.prometheus.grouping.Repository;
import dev.prometheus.grouping.Student;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

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
}
