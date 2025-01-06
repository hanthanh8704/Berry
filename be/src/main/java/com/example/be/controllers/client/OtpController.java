package com.example.be.controllers.client;


import com.example.be.services.client.OtpService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.imageio.ImageIO;
import java.awt.image.BufferedImage;
import java.io.ByteArrayOutputStream;
import java.util.Map;
import com.example.be.utils.qrCode.QRCodeGenerator;
@RestController
@RequestMapping("/api")
public class OtpController {


    @Autowired
    private OtpService otpService;

    @PostMapping("/send-otp")
    public ResponseEntity<String> sendOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        if (email == null || email.isEmpty()) {
            return ResponseEntity.badRequest().body("Email không được để trống.");
        }

        try {
            otpService.sendOtp(email);
            return ResponseEntity.ok("Mã OTP đã được gửi thành công!");
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Lỗi khi gửi OTP.");
        }
    }

    @PostMapping("/validate-otp")
    public ResponseEntity<String> validateOtp(@RequestBody Map<String, String> request) {
        String email = request.get("email");
        int otp = Integer.parseInt(request.get("otp"));

        boolean isValid = otpService.validateOtp(email, otp);
        if (isValid) {
            return ResponseEntity.ok("Mã OTP hợp lệ.");
        } else {
            return ResponseEntity.badRequest().body("Mã OTP không hợp lệ.");
        }
    }

    @GetMapping(value = "/qrcode", produces = MediaType.IMAGE_PNG_VALUE)
    public @ResponseBody byte[] generateQRCode(@RequestParam("codeBill") String codeBill) throws Exception {
        String qrContent = "https://yourdomain.com/order/" + codeBill; // Nội dung QR
        BufferedImage qrImage = QRCodeGenerator.generateQRCodeImageMaHD(qrContent); // Hàm sinh mã QR
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ImageIO.write(qrImage, "png", baos);
        return baos.toByteArray();
    }

}

