package com.example.be.utils;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;

import java.io.File;
import java.util.concurrent.CompletableFuture;

@Service
public class MailUtils {
    @Autowired
    private JavaMailSender javaMailSender;

    @Async
    public CompletableFuture<String> sendEmail(String to, String subject, String body) {
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(to);
        message.setSubject(subject);
        message.setText(body);
        javaMailSender.send(message);
        return CompletableFuture.completedFuture("Gửi mail thành công!");
    }

    /**
     *
     * Gửi mail client
     */

    @Async
    public CompletableFuture<String> sendEmailClient(String to, String subject, String body, String qrCodeFilePath) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true);  // true enables HTML

            // Đính kèm mã QR vào email
            FileSystemResource qrFile = new FileSystemResource(new File(qrCodeFilePath));
            helper.addInline("qrCodeImage", qrFile);

            javaMailSender.send(message);
            return CompletableFuture.completedFuture("Gửi mail thành công!");
        } catch (MessagingException e) {
            e.printStackTrace();
            return CompletableFuture.completedFuture("Gửi mail thất bại!");
        }
    }
}