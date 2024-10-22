package dev.prometheus.grouping.service;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    private final JavaMailSender mailSender;

    public MailService(JavaMailSender mailSender) {
        this.mailSender = mailSender;
    }

    public   void SendEmail (String to, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("pr0meth4us@icloud.com");
        message.setTo(to);
        message.setSubject("OTP");
        message.setText(text);
        mailSender.send(message);
    }

}
