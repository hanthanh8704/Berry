package com.example.be.services.client;

import jakarta.mail.internet.MimeMessage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import org.springframework.mail.javamail.MimeMessageHelper;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Service
public class OtpService {
    @Autowired
    private JavaMailSender mailSender;

    private final Map<String, Integer> otpStorage = new HashMap<>();

    public int generateOtp(String email) {
        int otp = 100000 + new Random().nextInt(900000); // Tạo mã OTP ngẫu nhiên 6 chữ số
        otpStorage.put(email, otp);
        return otp;
    }



    public void sendOtp(String email) {
        int otp = generateOtp(email);

        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, "utf-8");

            // Nội dung HTML cho email OTP
            String htmlContent = "<!DOCTYPE html>" +
                    "<html lang='en'>" +
                    "<head>" +
                    "    <meta charset='UTF-8'>" +
                    "    <meta name='viewport' content='width=device-width, initial-scale=1.0'>" +
                    "    <title>Xác Nhận OTP</title>" +
                    "    <style>" +
                    "        body { font-family: Arial, sans-serif; color: #333; background-color: #f4f4f4; margin: 0; padding: 0; }" +
                    "        .container { max-width: 600px; margin: 0 auto; padding: 20px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }" +
                    "        .header { background-color: #6A0DAD; color: #ffffff; padding: 20px; text-align: center; border-top-left-radius: 10px; border-top-right-radius: 10px; }" +
                    "        .header h1 { margin: 0; font-size: 24px; }" +
                    "        .content { padding: 20px; line-height: 1.6; }" +
                    "        .content p { font-size: 16px; }" +
                    "        .otp-code { font-size: 32px; color: #6A0DAD; font-weight: bold; margin: 20px 0; text-align: center; }" +
                    "        .footer { text-align: center; color: #888; font-size: 14px; margin-top: 20px; }" +
                    "    </style>" +
                    "</head>" +
                    "<body>" +
                    "    <div class='container'>" +
                    "        <div class='header'>" +
                    "            <h1>Xác Nhận Email Nhận Hàng</h1>" +
                    "        </div>" +
                    "        <div class='content'>" +
                    "            <p>Chào bạn,</p>" +
                    "            <p>Chúng tôi đã nhận được yêu cầu xác thực cho email của bạn. Vui lòng sử dụng mã OTP dưới đây để xác nhận:</p>" +
                    "            <div class='otp-code'>" + otp + "</div>" +
                    "            <p>Mã OTP này sẽ hết hạn sau 5 phút. Nếu bạn không thực hiện yêu cầu này, hãy bỏ qua email này.</p>" +
                    "            <p>Trân trọng,<br/>Đội ngũ hỗ trợ</p>" +
                    "        </div>" +
                    "        <div class='footer'>" +
                    "            © 2024 Your Company. Tất cả các quyền được bảo lưu." +
                    "        </div>" +
                    "    </div>" +
                    "</body>" +
                    "</html>";

            helper.setTo(email);
            helper.setSubject("Mã OTP Xác Nhận");
            helper.setText(htmlContent, true); // Thiết lập true để gửi nội dung HTML
            mailSender.send(mimeMessage);

            System.out.println("OTP đã được gửi tới email: " + email);
        } catch (Exception e) {
            System.err.println("Lỗi khi gửi OTP: " + e.getMessage());
        }
    }

    public boolean validateOtp(String email, int otp) {
        Integer storedOtp = otpStorage.get(email);
        return storedOtp != null && storedOtp == otp;
    }
}
