package com.example.connectdb.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "thanh_toan")
public class ThanhToan {
    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "ma_giao_dich")
    private Integer ma_giao_dich;

    @Column(name = "ten_hinh_thuc")
    private String tenHinhThuc;

    @Column(name = "tong_tien_thanh_toan")
    private BigDecimal tongTienThanhToan;

    @Column(name = "trang_thai")
    private String trangThai;
    @CreationTimestamp
    @Column(name = "ngay_tao")
    private Timestamp ngayTao;
    @UpdateTimestamp
    @Column(name = "ngay_sua")
    private Timestamp ngaySua;

    @Column(name = "nguoi_tao")
    private String nguoiTao;

    @Column(name = "nguoi_sua")
    private String nguoiSua;

    @Column(name = "ghi_chu")
    private String ghiChu;
}
