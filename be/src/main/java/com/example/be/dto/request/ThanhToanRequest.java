package com.example.be.dto.request;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
public class ThanhToanRequest {
    private Integer hoaDon;
    private String tenPhuongThuoc;
    private BigDecimal tongTien;
    private String ghiChu;
    private Integer maGiaoDich;
    private Boolean loai;
}
