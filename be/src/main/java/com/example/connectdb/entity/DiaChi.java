package com.example.connectdb.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "dia_chi")
public class DiaChi {
    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "id_khach_hang")
    private Integer idKhachHang;

    @Column(name = "duong")
    private String duong;

    @Column(name = "thanh_pho")
    private String thanhPho;

    @Column(name = "phuong")
    private String phuong;

    @Column(name = "tinh")
    private String tinh;

    @Column(name = "ngay_tao")
    private java.sql.Timestamp ngayTao;

    @Column(name = "ngay_sua")
    private java.sql.Timestamp ngaySua;

    @Column(name = "ngay_sua_cuoi")
    private java.sql.Timestamp ngaySuaCuoi;

    @Column(name = "trang_thai")
    private Integer trangThai;

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

    public Integer getIdKhachHang() {
        return this.idKhachHang;
    }

    public void setIdKhachHang(Integer idKhachHang) {
        this.idKhachHang = idKhachHang;
    }

    public String getDuong() {
        return this.duong;
    }

    public void setDuong(String duong) {
        this.duong = duong;
    }

    public String getThanhPho() {
        return this.thanhPho;
    }

    public void setThanhPho(String thanhPho) {
        this.thanhPho = thanhPho;
    }

    public String getPhuong() {
        return this.phuong;
    }

    public void setPhuong(String phuong) {
        this.phuong = phuong;
    }

    public String getTinh() {
        return this.tinh;
    }

    public void setTinh(String tinh) {
        this.tinh = tinh;
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

    public java.sql.Timestamp getNgaySuaCuoi() {
        return this.ngaySuaCuoi;
    }

    public void setNgaySuaCuoi(java.sql.Timestamp ngaySuaCuoi) {
        this.ngaySuaCuoi = ngaySuaCuoi;
    }

    public Integer getTrangThai() {
        return this.trangThai;
    }

    public void setTrangThai(Integer trangThai) {
        this.trangThai = trangThai;
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
