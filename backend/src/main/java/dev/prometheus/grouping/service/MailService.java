package dev.prometheus.grouping.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    @Autowired
    private JavaMailSender mailSender;

    public   void SendEmail (String to, String text) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom("pr0meth4us@icloud.com");
        message.setTo(to);
        message.setSubject("OTP");
        message.setText(text);
        mailSender.send(message);
    }

}
