package com.example.be.entity;

import jakarta.persistence.*;
import lombok.*;
import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "dia_chi")
public class DiaChi {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "id_khach_hang")
    private KhachHang khachHang;
    @Column(name = "ho_ten")
    private String hoTen;
    @Column(name = "so_dien_thoai")
    private String soDienThoai;
    @Column(name = "duong")
    private String duong;

    @Column(name = "thanh_pho")
    private String thanhPho;

    @Column(name = "phuong")
    private String phuong;

    @Column(name = "tinh")
    private String tinh;

    @Column(name = "ghichu")
    private String ghichu;

    @Column(name = "ngay_tao")
    private Timestamp ngayTao;

    @Column(name = "ngay_sua")
    private Timestamp ngaySua;

    @Column(name = "ngay_sua_cuoi")
    private Timestamp ngaySuaCuoi;

    @Column(name = "trang_thai")
    private Integer trangThai;

    @Column(name = "nguoi_tao")
    private String nguoiTao;

    @Column(name = "nguoi_sua")
    private String nguoiSua;
}
