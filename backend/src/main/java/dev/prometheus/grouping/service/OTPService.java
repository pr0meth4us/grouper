package dev.prometheus.grouping.service;

import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class OTPService {
    private final Map<String, OTPInfo> otpStore = new HashMap<>();

    public String generateOTP() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(1_000_000));
    }

    public boolean storeOTPAndSendToUser(String email, String otpCode) {
        OTPInfo otpInfo = new OTPInfo(otpCode, email);
        otpStore.put(email, otpInfo);

        return true;
    }

    public boolean verifyOTP(String email, String otpCode) {
        OTPInfo storedOTPInfo = otpStore.get(email);
        if (storedOTPInfo != null && storedOTPInfo.getCode().equals(otpCode)) {
            otpStore.remove(email);
            return true;
        }
        return false;
    }

    protected static class OTPInfo {
        private final String code;
        private final String email;

        OTPInfo(String code, String email) {
            this.code = code;
            this.email = email;
        }

        String getCode() {
            return code;
        }

        String getEmail() {
            return email;
        }
    }
}