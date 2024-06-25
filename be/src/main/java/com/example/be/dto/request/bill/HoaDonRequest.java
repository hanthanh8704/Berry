package com.example.be.dto.request.bill;

import jakarta.validation.constraints.NotNull;
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
public class HoaDonRequest {
    // DTO Data Transfer Object
    private Integer id;
    private String ma;
    private String tenNhanVien; // Thay vì idNhanVien
    private String tenKhachHang; // Thay vì idKhachHang
    private String tenHinhThucThanhToan; // Thay vì idHinhThucThanhToan
    private String tenNguoiNhan;
    private BigDecimal tongTien;
    private BigDecimal phiShip;
    private String emailNguoiNhan;
    @Size(max = 20, message = "Phone number should not be greater than 20 characters")
    private String soDienThoaiNguoiNhan;

    private String trangThaiHoaDon;
    private String trangThaiGiaoHang;

    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private Timestamp ngayGiaoDich;
    private Integer maGiaoDich;
    private BigDecimal tongTienSauGiamGia;
    private String diaChi;
    private String ghiChu;
}
