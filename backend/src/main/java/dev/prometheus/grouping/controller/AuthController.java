package dev.prometheus.grouping.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.prometheus.grouping.model.User;
import dev.prometheus.grouping.service.AuthService;
import dev.prometheus.grouping.service.OTPService;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;
    private final OTPService otpService;

    @Autowired
    public AuthController(AuthService authService, OTPService otpService) {
        this.authService = authService;
        this.otpService = otpService;
    }

    @SneakyThrows
    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOTP(@RequestBody String req) {
        String email = new ObjectMapper().readTree(req).get("email").asText();
        authService.sendOtp(email);
        return ResponseEntity.ok("sent to" + email);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody JsonNode req) {
        String email = req.get("email").asText();
        String otpCode = req.get("otp").asText();  // renamed for clarity
        String password = req.get("password").asText();

        System.out.println("Registration request for email: " + email);
        System.out.println("With OTP code: " + otpCode);


        Optional<User> registeredUser = authService.register(email, password, otpCode);
        if (registeredUser.isPresent()) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.badRequest().build();
    }
}