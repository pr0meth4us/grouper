package dev.prometheus.grouping.service;

import dev.prometheus.grouping.dto.ApiResponse;
import dev.prometheus.grouping.model.User;
import dev.prometheus.grouping.repository.UserRepository;
import jakarta.mail.MessagingException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;
import org.springframework.http.ResponseCookie;
import org.springframework.http.HttpHeaders;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final OTPService otpService;
    private final MailService mailService;
    private final JwtService jwtService;

    private static final int COOKIE_MAX_AGE = 86400; // 24 hours in seconds

    public AuthService(UserRepository userRepository, OTPService otpService,
                       MailService mailService, JwtService jwtService) {
        this.userRepository = userRepository;
        this.otpService = otpService;
        this.mailService = mailService;
        this.jwtService = jwtService;
    }

    public void sendOtp(String email) {
        String otpCode = otpService.generateOTP();
        otpService.storeOTPAndSendToUser(email, otpCode);
        try {
            mailService.sendOtpEmail(email, otpCode);
        } catch (MessagingException e) {
            System.err.println("Failed to send OTP email to " + email + ". Error: " + e.getMessage());
            throw new RuntimeException("Error sending verification email. Please try again later.", e);
        }
    }

    public ApiResponse register(String email, String password, String otpCode) {
        User existingUser = userRepository.findByEmail(email);
        if (existingUser != null) {
            return new ApiResponse(false, "Email is already registered.", null);
        }
        if (!otpService.verifyOTP(email, otpCode)) {
            return new ApiResponse(false, "Invalid OTP code.", null);
        }

        User user = new User();
        user.setEmail(email);
        user.setPassword(password);
        userRepository.save(user);

        return new ApiResponse(true, "Registration successful.", user);
    }

    public ApiResponse login(String email, String password, HttpServletResponse response) {
        User user = userRepository.findByEmail(email);
        if (user == null || !user.verifyPassword(password)) {
            return new ApiResponse(false, "Invalid Credentials", null);
        }
        String token = jwtService.generateToken(email);

        ResponseCookie jwtCookie = ResponseCookie.from("jwt_token", token)
                .httpOnly(true)
                .path("/")
                .maxAge(COOKIE_MAX_AGE)
                .secure(true)
                .sameSite("None")
                .build();

        response.addHeader(HttpHeaders.SET_COOKIE, jwtCookie.toString());
        Map<String, Object> responseData = new HashMap<>();
        responseData.put("user", user);
        responseData.put("token", token);
        return new ApiResponse(true, "Login successful", responseData);
    }

    public void logout(HttpServletResponse response) {
        Cookie jwtCookie = new Cookie("jwt_token", null);
        jwtCookie.setHttpOnly(true);
        jwtCookie.setPath("/");
        // Setting max age to 0 tells the browser to delete the cookie
        jwtCookie.setMaxAge(0);
        response.addCookie(jwtCookie);
    }
}
