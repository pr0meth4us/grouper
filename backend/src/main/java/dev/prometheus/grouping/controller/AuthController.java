package dev.prometheus.grouping.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dev.prometheus.grouping.dto.ApiResponse;
import dev.prometheus.grouping.dto.LoginRequest;
import dev.prometheus.grouping.model.User;
import dev.prometheus.grouping.repository.UserRepository;
import dev.prometheus.grouping.service.AuthService;
import dev.prometheus.grouping.service.JwtService;
import jakarta.servlet.http.HttpServletResponse;
import lombok.SneakyThrows;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/auth")
public class AuthController {
    private final AuthService authService;
    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Autowired
    public AuthController(AuthService authService, JwtService jwtService, UserRepository userRepository) {
        this.authService = authService;
        this.jwtService = jwtService;
        this.userRepository = userRepository;
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

    @GetMapping("/verify")
    public ResponseEntity<ApiResponse> verifyAuth(
            @CookieValue(name = "jwt_token", required = false) String token) {
        if (token == null) {
            return ResponseEntity.ok(new ApiResponse(false, "No token found", null));
        }

        try {
            String email = jwtService.validateTokenAndGetEmail(token);
            User user = userRepository.findByEmail(email);

            if (user == null) {
                return ResponseEntity.ok(new ApiResponse(false, "User not found", null));
            }

            Map<String, Object> userData = new HashMap<>();
            userData.put("email", user.getEmail());
            userData.put("id", user.getId());

            return ResponseEntity.ok(new ApiResponse(true, "Token is valid", userData));
        } catch (Exception e) {
            return ResponseEntity.ok(new ApiResponse(false, "Invalid token", null));
        }
    }
}