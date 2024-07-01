package com.example.be.entity;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.sql.Timestamp;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
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

    @Column(name = "dia_chi_mac_dinh")
    private Boolean diaChiMacDinh;

    @Column(name = "ngay_tao")
    @CreationTimestamp
    private Timestamp ngayTao;

    @Column(name = "ngay_sua")
    @UpdateTimestamp
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
