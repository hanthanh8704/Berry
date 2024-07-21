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
@Table(name = "nhan_vien")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class NhanVien {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private Account account;

    @ManyToOne
    @JoinColumn(name = "id_chuc_vu")
    private ChucVu chucVu;

    @Column(name = "ma", columnDefinition = "NVARCHAR(50)")
    private String ma;

    @Column(name = "ten", columnDefinition = "NVARCHAR(255)")
    private String ten;

    @Column(name = "anh", columnDefinition = "NVARCHAR(255)")
    private String anh;

    @Column(name = "dia_chi_cu_the", columnDefinition = "NVARCHAR(255)")
    private String diaChiCuThe;

    @Column(name = "thanh_pho", columnDefinition = "NVARCHAR(255)")
    private String thanhPho;

    @Column(name = "huyen", columnDefinition = "NVARCHAR(255)")
    private String huyen;

    @Column(name = "phuong", columnDefinition = "NVARCHAR(255)")
    private String phuong;

    @Column(name = "ngay_sinh")
    private LocalDate ngaySinh;

    @Column(name = "so_dien_thoai", columnDefinition = "NVARCHAR(255)")
    private String soDienThoai;

    @Column(name = "gioi_tinh", columnDefinition = "NVARCHAR(255)")
    private String gioiTinh;

    @Column(name = "email", columnDefinition = "NVARCHAR(255)")
    private String email;

    @Column(name = "cccd", columnDefinition = "NVARCHAR(255)")
    private String cccd;

    @Column(name = "trang_thai", columnDefinition = "NVARCHAR(255)")
    private String trangThai;

    @Column(name = "ghi_chu", columnDefinition = "NVARCHAR(255)")
    private String ghiChu;

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

