package com.example.connectdb.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "khach_hang")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KhachHang {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

    @Column(name = "ma", columnDefinition = "NVARCHAR(50)")
    private String ma;

    @Column(name = "ho_ten", columnDefinition = "NVARCHAR(255)")
    private String hoTen;

    @Column(name = "gioi_tinh", columnDefinition = "NVARCHAR(255)")
    private String gioiTinh;

    @Column(name = "anh", columnDefinition = "NVARCHAR(255)")
    private String anh;

    @Column(name = "so_dien_thoai", columnDefinition = "NVARCHAR(255)")
    private String soDienThoai;

    @Column(name = "email", columnDefinition = "NVARCHAR(255)")
    private String email;

    @Column(name = "ngay_sinh")
    private LocalDate ngaySinh;

    @Column(name = "ghi_chu", columnDefinition = "NVARCHAR(255)")
    private String ghiChu;

    @Column(name = "trang_thai", columnDefinition = "NVARCHAR(255)")
    private String trangThai;

    @Column(name = "ngay_tao", nullable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime ngayTao;

    @Column(name = "ngay_sua", nullable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    private LocalDateTime ngaySua;

    @Column(name = "nguoi_tao", columnDefinition = "NVARCHAR(255)")
    private String nguoiTao;

    @Column(name = "nguoi_sua", columnDefinition = "NVARCHAR(255)")
    private String nguoiSua;

    @Column(name = "deleted")
    private Boolean deleted;

}

