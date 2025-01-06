package com.example.be.utils;

import com.example.be.dto.admin.response.bill.InvoiceResponse;
import com.example.be.utils.email.SendEmailService;
import com.example.be.utils.exportPdf.ExportFilePdfFormHtml;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.FileSystemResource;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.io.File;
import java.util.concurrent.CompletableFuture;

@Service
public class MailUtils {
    @Autowired
    private JavaMailSender javaMailSender;
    @Autowired
    private ExportFilePdfFormHtml exportFilePdfFormHtml;
    @Autowired
    private SendEmailService sendEmailService;
    @Autowired
    private SpringTemplateEngine springTemplateEngine;

    @Async
    public CompletableFuture<String> sendEmail(String to, String subject, String body) {
        try {
            MimeMessage message = javaMailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setTo(to);
            helper.setSubject(subject);
            helper.setText(body, true); // 'true' để chỉ định nội dung là HTML

            javaMailSender.send(message);
            return CompletableFuture.completedFuture("Gửi mail thành công!");
        } catch (Exception e) {
            e.printStackTrace();
            return CompletableFuture.completedFuture("Gửi mail thất bại: " + e.getMessage());
        }
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

    public void sendMail(InvoiceResponse invoice, String url, String email) {
        if (email.matches("^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$")) {
            String finalHtmlSendMail = null;
            Context dataContextSendMail = exportFilePdfFormHtml.setDataSendMail(invoice, url);
            finalHtmlSendMail = springTemplateEngine.process("templateBill", dataContextSendMail);
            String subject = "Biên lai thanh toán ";
            sendEmailService.sendBill(email, subject, finalHtmlSendMail);
        }
    }
}