package dev.prometheus.grouping.service;

import dev.prometheus.grouping.model.User;
import dev.prometheus.grouping.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {
    private final UserRepository userRepository;
    private final OTPService otpService;
    private final MailService mailService;

    public AuthService(UserRepository userRepository, OTPService otpService, MailService mailService) {
        this.userRepository = userRepository;
        this.otpService = otpService;
        this.mailService = mailService;
    }

    public String sendOtp(String email) {
        String otpCode = otpService.generateOTP();
        otpService.storeOTPAndSendToUser(email, otpCode);
        mailService.SendEmail(email, otpCode);
        return otpCode;
    }

    public Optional<User> register(String email, String password, String otpCode) {
        if (otpService.verifyOTP( email, otpCode)) {
            User user = new User();
            user.setEmail(email);
            user.setPassword(password);
            return Optional.of(userRepository.save(user));
        }
        return Optional.empty();
    }
}
