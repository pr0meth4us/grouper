package dev.prometheus.grouping.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public void sendOtpEmail(String to, String otpCode) throws MessagingException {
        MimeMessage mimeMessage = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

        String htmlContent = """
            <div style="font-family: Arial, sans-serif; text-align: center; color: #333; line-height: 1.6;">
                <div style="max-width: 600px; margin: 20px auto; border: 1px solid #ddd; border-radius: 12px; padding: 30px;">
                    <h1 style="color: #4A90E2;">Your Grouper Verification Code</h1>
                    <p style="font-size: 16px;">Please use the following code to complete your registration. This code is valid for 5 minutes.</p>
                    <div style="background-color: #f2f2f2; font-size: 28px; font-weight: bold; letter-spacing: 4px; padding: 15px 20px; border-radius: 8px; margin: 25px 0; display: inline-block;">
                        %s
                    </div>
                    <p style="font-size: 14px; color: #777;">If you did not request this code, you can safely ignore this email.</p>
                    <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;"/>
                    <p style="font-size: 12px; color: #aaa;">&copy; 2025 Grouper</p>
                </div>
            </div>
        """;

        // Set email properties
        helper.setFrom(fromEmail);
        helper.setTo(to);
        helper.setSubject("Your Grouper OTP Code");
        helper.setText(String.format(htmlContent, otpCode), true); // true indicates HTML content

        mailSender.send(mimeMessage);
    }
}