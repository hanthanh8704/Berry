package com.example.be.entity;

import javax.persistence.*;
import java.sql.Timestamp;

@Entity
@Table(name = "dia_chi")
public class DiaChi {
    @Id
    @Column(name = "id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_khach_hang")
    private KhachHang khachHang;

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
