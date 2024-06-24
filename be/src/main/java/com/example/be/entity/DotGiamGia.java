package com.example.be.entity;

import javax.persistence.*;

@Entity
@Table(name = "dot_giam_gia")
public class DotGiamGia {
    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "ma")
    private String ma;

    @Column(name = "ten")
    private String ten;

    @Column(name = "loai_khuyen_mai")
    private String loaiKhuyenMai;

    @Column(name = "trang_thai")
    private Integer trangThai;

    @Column(name = "ngay_bat_dau")
    private java.sql.Timestamp ngayBatDau;

    @Column(name = "ngay_ket_thuc")
    private java.sql.Timestamp ngayKetThuc;

    @Column(name = "ngay_tao")
    private java.sql.Timestamp ngayTao;

    @Column(name = "ngay_sua")
    private java.sql.Timestamp ngaySua;

    @Column(name = "nguoi_tao")
    private String nguoiTao;

    @Column(name = "nguoi_sua")
    private String nguoiSua;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getMa() {
        return this.ma;
    }

    public void setMa(String ma) {
        this.ma = ma;
    }

    public String getTen() {
        return this.ten;
    }

    public void setTen(String ten) {
        this.ten = ten;
    }

    public String getLoaiKhuyenMai() {
        return this.loaiKhuyenMai;
    }

    public void setLoaiKhuyenMai(String loaiKhuyenMai) {
        this.loaiKhuyenMai = loaiKhuyenMai;
    }

    public Integer getTrangThai() {
        return this.trangThai;
    }

    public void setTrangThai(Integer trangThai) {
        this.trangThai = trangThai;
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

    public String getNguoiTao() {
        return this.nguoiTao;
    }

    public void setNguoiTao(String nguoiTao) {
        this.nguoiTao = nguoiTao;
    }

    public String getNguoiSua() {
        return this.nguoiSua;
    }

    public void setNguoiSua(String nguoiSua) {
        this.nguoiSua = nguoiSua;
    }
}
