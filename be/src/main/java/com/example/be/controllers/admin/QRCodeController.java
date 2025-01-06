package com.example.be.controllers.admin;

import com.example.be.utils.qrCode.QRCodeGenerator;
import com.google.zxing.WriterException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
public class QRCodeController {

    @GetMapping("/api/qr-code/{text}")
    public ResponseEntity<byte[]> downloadQRCode(@PathVariable("text") String text) {
        try {
            // Kích thước QR code
            int width = 300;
            int height = 300;

            // Tạo QR code dưới dạng byte[]
            byte[] qrCodeImage = QRCodeGenerator.getQRCodeImage(text, width, height);

            // Cấu hình header cho file tải xuống
            HttpHeaders headers = new HttpHeaders();
            headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=qr-code.png");

            return ResponseEntity
                    .status(HttpStatus.OK)
                    .headers(headers)
                    .body(qrCodeImage);

        } catch (WriterException | IOException e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
