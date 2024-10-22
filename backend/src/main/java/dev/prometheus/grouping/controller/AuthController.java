package dev.prometheus.grouping.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.prometheus.grouping.dto.ApiResponse;
import dev.prometheus.grouping.dto.LoginRequest;
import dev.prometheus.grouping.service.AuthService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.Map;

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
    public ResponseEntity<String> sendOTP(@RequestBody String req) {
        String email = new ObjectMapper().readTree(req).get("email").asText();
        authService.sendOtp(email);
        return ResponseEntity.ok("sent to" + email);
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse> registerUser(@RequestBody JsonNode req) {
        String email = req.get("email").asText();
        String otpCode = req.get("otp").asText();
        String password = req.get("password").asText();

        ApiResponse response = authService.register(email, password, otpCode);

        if (!response.isSuccess()) {
            return ResponseEntity.badRequest().body(response);
        }
        return ResponseEntity.ok(response);
    }

    @PostMapping("/login")
    public ResponseEntity<ApiResponse> login(
            @RequestBody LoginRequest loginRequest,
            HttpServletResponse response) {
        ApiResponse apiResponse = authService.login(
                loginRequest.getEmail(),
                loginRequest.getPassword(),
                response
        );
        return ResponseEntity.ok(apiResponse);
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        authService.logout(response);
        return ResponseEntity.ok().body(Map.of("message", "Logged out successfully"));
    }
}