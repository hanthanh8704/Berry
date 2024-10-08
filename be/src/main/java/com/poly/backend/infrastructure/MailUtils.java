package com.poly.backend.infrastructure;


import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeBodyPart;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.stereotype.Service;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;

import java.io.File;
import java.util.concurrent.CompletableFuture;
import org.springframework.mail.javamail.MimeMessageHelper;


@Service
public class MailUtils {

    @Autowired
    private JavaMailSender javaMailSender;

    @Async
    public CompletableFuture<String> sendEmail(String to, String subject, String body, String qrCodeFilePath) {
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



