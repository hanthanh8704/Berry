package com.example.be.entity;

import javax.persistence.*;

@Entity
@Table(name = "spct_khuyen_mai")
public class SpctKhuyenMai {
    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "id_dot_giam_gia")
    private Integer idDotGiamGia;

    @Column(name = "id_san_pham")
    private Integer idSanPham;

    @Column(name = "gia_cu")
    private BigDecimal giaCu;

    @Column(name = "gia_moi")
    private BigDecimal giaMoi;

    @Column(name = "giam_gia")
    private BigDecimal giamGia;

    @Column(name = "ngay_tao")
    private java.sql.Timestamp ngayTao;

    @Column(name = "ngay_sua")
    private java.sql.Timestamp ngaySua;

    @Column(name = "ngay_bat_dau")
    private java.sql.Timestamp ngayBatDau;

    @Column(name = "ngay_ket_thuc")
    private java.sql.Timestamp ngayKetThuc;

    @Column(name = "trang_thai")
    private Integer trangThai;

    public Integer getId() {
        return this.id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getIdDotGiamGia() {
        return this.idDotGiamGia;
    }

    public void setIdDotGiamGia(Integer idDotGiamGia) {
        this.idDotGiamGia = idDotGiamGia;
    }

    public Integer getIdSanPham() {
        return this.idSanPham;
    }

    public void setIdSanPham(Integer idSanPham) {
        this.idSanPham = idSanPham;
    }

    public BigDecimal getGiaCu() {
        return this.giaCu;
    }

    public void setGiaCu(BigDecimal giaCu) {
        this.giaCu = giaCu;
    }

    public BigDecimal getGiaMoi() {
        return this.giaMoi;
    }

    public void setGiaMoi(BigDecimal giaMoi) {
        this.giaMoi = giaMoi;
    }

    public BigDecimal getGiamGia() {
        return this.giamGia;
    }

    public void setGiamGia(BigDecimal giamGia) {
        this.giamGia = giamGia;
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

    public Integer getTrangThai() {
        return this.trangThai;
    }

    public void setTrangThai(Integer trangThai) {
        this.trangThai = trangThai;
    }
}
