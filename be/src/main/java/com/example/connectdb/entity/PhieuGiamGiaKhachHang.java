package com.example.connectdb.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "phieu_giam_gia_khach_hang")
public class PhieuGiamGiaKhachHang {
    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "id_phieu_giam_gia")
    private Integer idPhieuGiamGia;

    @Column(name = "id_khach_hang")
    private Integer idKhachHang;

    @Column(name = "ma")
    private String ma;

    @Column(name = "trang_thai")
    private String trangThai;

    @Column(name = "ngay_tao")
    private java.sql.Timestamp ngayTao;

    @Column(name = "ngay_sua")
    private java.sql.Timestamp ngaySua;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getIdPhieuGiamGia() {
        return this.idPhieuGiamGia;
    }

    public void setIdPhieuGiamGia(Integer idPhieuGiamGia) {
        this.idPhieuGiamGia = idPhieuGiamGia;
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

    public String getTrangThai() {
        return this.trangThai;
    }

    public void setTrangThai(String trangThai) {
        this.trangThai = trangThai;
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
}
