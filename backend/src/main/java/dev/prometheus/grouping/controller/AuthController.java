package dev.prometheus.grouping.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.prometheus.grouping.service.AuthService;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;

    @Autowired
    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @SneakyThrows
    @PostMapping("/send-otp")
    public ResponseEntity<String> createStudent(@RequestBody String req) {
        String email = new ObjectMapper().readTree(req).get("email").asText();
        authService.sendOtp(email);
        return ResponseEntity.ok("sent to" + email);
    }

}