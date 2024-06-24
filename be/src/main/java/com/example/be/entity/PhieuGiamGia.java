package com.example.be.entity;

import jakarta.persistence.*;

import java.math.BigDecimal;

@Entity
@Table(name = "phieu_giam_gia")
public class PhieuGiamGia {
    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "ma_code")
    private String maCode;

    @Column(name = "ten")
    private String ten;

    @Column(name = "so_luong")
    private Integer soLuong;

    @Column(name = "ngay_bat_dau")
    private java.sql.Timestamp ngayBatDau;

    @Column(name = "ngay_ket_thuc")
    private java.sql.Timestamp ngayKetThuc;

    @Column(name = "ngay_tao")
    private java.sql.Timestamp ngayTao;

    @Column(name = "ngay_sua")
    private java.sql.Timestamp ngaySua;

    @Column(name = "trang_thai")
    private Integer trangThai;

    @Column(name = "gia_tri_hoa_don_duoc_ap_dung")
    private BigDecimal giaTriHoaDonDuocApDung;

    @Column(name = "gia_tri_hoa_don_duoc_giam")
    private BigDecimal giaTriHoaDonDuocGiam;

    @Column(name = "hinh_thuc_giam")
    private String hinhThucGiam;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getMaCode() {
        return this.maCode;
    }

    public void setMaCode(String maCode) {
        this.maCode = maCode;
    }

    public String getTen() {
        return this.ten;
    }

    public void setTen(String ten) {
        this.ten = ten;
    }

    public Integer getSoLuong() {
        return this.soLuong;
    }

    public void setSoLuong(Integer soLuong) {
        this.soLuong = soLuong;
    }

    public java.sql.Timestamp getNgayBatDau() {
        return this.ngayBatDau;
    }

    public void setNgayBatDau(java.sql.Timestamp ngayBatDau) {
        this.ngayBatDau = ngayBatDau;
    }

    public java.sql.Timestamp getNgayKetThuc() {
        return this.ngayKetThuc;
    }

    public void setNgayKetThuc(java.sql.Timestamp ngayKetThuc) {
        this.ngayKetThuc = ngayKetThuc;
    }

    public java.sql.Timestamp getNgayTao() {
        return this.ngayTao;
    }

    public void setNgayTao(java.sql.Timestamp ngayTao) {
        this.ngayTao = ngayTao;
    }

    public java.sql.Timestamp getNgaySua() {
        return this.ngaySua;
    }

    public void setNgaySua(java.sql.Timestamp ngaySua) {
        this.ngaySua = ngaySua;
    }

    public Integer getTrangThai() {
        return this.trangThai;
    }

    public void setTrangThai(Integer trangThai) {
        this.trangThai = trangThai;
    }

    public BigDecimal getGiaTriHoaDonDuocApDung() {
        return this.giaTriHoaDonDuocApDung;
    }

    public void setGiaTriHoaDonDuocApDung(BigDecimal giaTriHoaDonDuocApDung) {
        this.giaTriHoaDonDuocApDung = giaTriHoaDonDuocApDung;
    }

    public BigDecimal getGiaTriHoaDonDuocGiam() {
        return this.giaTriHoaDonDuocGiam;
    }

    public void setGiaTriHoaDonDuocGiam(BigDecimal giaTriHoaDonDuocGiam) {
        this.giaTriHoaDonDuocGiam = giaTriHoaDonDuocGiam;
    }

    public String getHinhThucGiam() {
        return this.hinhThucGiam;
    }

    public void setHinhThucGiam(String hinhThucGiam) {
        this.hinhThucGiam = hinhThucGiam;
    }
}