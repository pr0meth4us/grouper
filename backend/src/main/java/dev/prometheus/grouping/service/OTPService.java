package dev.prometheus.grouping.service;

import lombok.Getter;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
public class OTPService {
    private final RedisTemplate<String, OTPInfo> redisTemplate;
    private static final long OTP_VALID_DURATION = 5;
    private static final String APP_NAME = "hestia";

    public OTPService(RedisTemplate<String, OTPInfo> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public String generateOTP() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(1_000_000));
    }

    public boolean storeOTPAndSendToUser(String email, String otpCode) {
        try {
            String key = String.format("%s:OTP:%s", APP_NAME, email);
            OTPInfo otpInfo = new OTPInfo(otpCode, email, APP_NAME);
            redisTemplate.opsForValue().set(key, otpInfo);
            redisTemplate.expire(key, OTP_VALID_DURATION, TimeUnit.MINUTES);

            System.out.println("Stored OTP with key: " + key);
            System.out.println("OTP Info: " + otpInfo);
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public boolean verifyOTP(String email, String otpCode) {
        try {
            String key = String.format("%s:OTP:%s", APP_NAME, email);
            OTPInfo storedOTPInfo = redisTemplate.opsForValue().get(key);

            System.out.println("Verifying OTP for email: " + email);
            System.out.println("Provided OTP code: " + otpCode);
            System.out.println("Looking up key: " + key);
            System.out.println("Found stored info: " + storedOTPInfo);
            System.out.println("OTP CODE: " + storedOTPInfo.getCode());

            if (storedOTPInfo != null && storedOTPInfo.getCode().equals(otpCode)) {
                redisTemplate.delete(key);
                return true;
            }
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    @Getter
    public static class OTPInfo implements java.io.Serializable {
        private static final long serialVersionUID = 1L;

        private String code;
        private String email;
        private String appName;

        public OTPInfo() {
        }

        public OTPInfo(String code, String email, String appName) {
            this.code = code;
            this.email = email;
            this.appName = appName;
        }

        @Override
        public String toString() {
            return "OTPInfo{" +
                    "code='" + code + '\'' +
                    ", email='" + email + '\'' +
                    ", appName='" + appName + '\'' +
                    '}';
        }
    }
}