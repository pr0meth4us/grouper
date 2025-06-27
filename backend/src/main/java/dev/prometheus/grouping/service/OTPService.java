package dev.prometheus.grouping.service;

import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import java.io.Serial;
import java.util.Random;
import java.util.concurrent.TimeUnit;

@Service
public class OTPService {
    private final RedisTemplate<String, OTPInfo> redisTemplate;
    private static final long OTP_VALID_DURATION = 5;
    private static final String APP_NAME = "grouper";

    public OTPService(RedisTemplate<String, OTPInfo> redisTemplate) {
        this.redisTemplate = redisTemplate;
    }

    public String generateOTP() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(1_000_000));
    }

    public void storeOTPAndSendToUser(String email, String otpCode) {
        try {
            String key = String.format("%s:OTP:%s", APP_NAME, email);
            OTPInfo otpInfo = new OTPInfo(otpCode, email, APP_NAME);
            redisTemplate.opsForValue().set(key, otpInfo);
            redisTemplate.expire(key, OTP_VALID_DURATION, TimeUnit.MINUTES);

            System.out.println("Stored OTP with key: " + key);
            System.out.println("OTP Info: " + otpInfo);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    public boolean verifyOTP(String email, String otpCode) {
        try {
            String key = String.format("%s:OTP:%s", APP_NAME, email);
            OTPInfo storedOTPInfo = redisTemplate.opsForValue().get(key);
            if (storedOTPInfo != null && storedOTPInfo.code().equals(otpCode)) {
                redisTemplate.delete(key);
                return true;
            }
            return false;
        } catch (Exception e) {
            e.printStackTrace();
            return false;
        }
    }

    public record OTPInfo(String code, String email, String appName) implements java.io.Serializable {
        @Serial
        private static final long serialVersionUID = 1L;

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