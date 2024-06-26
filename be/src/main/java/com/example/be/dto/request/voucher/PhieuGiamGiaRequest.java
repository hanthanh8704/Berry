package com.example.be.dto.request.voucher;

import jakarta.persistence.Column;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.format.annotation.DateTimeFormat;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Data
public class PhieuGiamGiaRequest {
    private Integer id;
    private String ma;
    private String ten;
    private Integer soLuong;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private java.sql.Timestamp ngayBatDau;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private java.sql.Timestamp ngayKetThuc;
    private java.sql.Timestamp ngayTao;
    private java.sql.Timestamp ngaySua;
    private String trangThai;
    private BigDecimal giaTriToiDa;
    private BigDecimal giaTriGiam;
    private String kieuGiam;
    private String nguoiTao;
    private String nguoiSua;
}
