package com.example.connectdb.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "gio_hang")
public class GioHang {
    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "id_khach_hang")
    private Integer idKhachHang;

    @Column(name = "ma")
    private String ma;

    @Column(name = "ngay_tao")
    private java.sql.Timestamp ngayTao;

    @Column(name = "trang_thai")
    private Integer trangThai;

    @Column(name = "ngay_thanh_toan")
    private java.sql.Timestamp ngayThanhToan;

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

    public String getMa() {
        return this.ma;
    }

    public void setMa(String ma) {
        this.ma = ma;
    }

    public java.sql.Timestamp getNgayTao() {
        return this.ngayTao;
    }

    public void setNgayTao(java.sql.Timestamp ngayTao) {
        this.ngayTao = ngayTao;
    }

    public Integer getTrangThai() {
        return this.trangThai;
    }

    public void setTrangThai(Integer trangThai) {
        this.trangThai = trangThai;
    }

    public java.sql.Timestamp getNgayThanhToan() {
        return this.ngayThanhToan;
    }

    public void setNgayThanhToan(java.sql.Timestamp ngayThanhToan) {
        this.ngayThanhToan = ngayThanhToan;
    }
}
