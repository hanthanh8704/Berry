package com.example.connectdb.dto.request.product;

import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SanPhamRequest {
    // DTO Data Transfer Object
    private Integer id;
    private String ma;
    private String tenSanPham;
    private String tenMauSac;
    private String tenKichCo;
    private String tenThuonHieu;
    private String tenChatLieu;
    private String tenTayAo;
    private String tenCoAo;
}
