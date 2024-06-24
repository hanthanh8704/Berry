package com.example.connectdb.entity;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "gio_hang_chi_tiet")
public class GioHangChiTiet {
    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "id_gio_hang")
    private Integer idGioHang;

    @Column(name = "id_chi_tiet_san_pham")
    private Integer idChiTietSanPham;

    @Column(name = "so_luong_san_pham")
    private Integer soLuongSanPham;

    @Column(name = "ngay_tao")
    private java.sql.Timestamp ngayTao;

    @Column(name = "lan_sua_cuoi")
    private java.sql.Timestamp lanSuaCuoi;

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

    public Integer getIdGioHang() {
        return this.idGioHang;
    }

    public void setIdGioHang(Integer idGioHang) {
        this.idGioHang = idGioHang;
    }

    public Integer getIdChiTietSanPham() {
        return this.idChiTietSanPham;
    }

    public void setIdChiTietSanPham(Integer idChiTietSanPham) {
        this.idChiTietSanPham = idChiTietSanPham;
    }

    public Integer getSoLuongSanPham() {
        return this.soLuongSanPham;
    }

    public void setSoLuongSanPham(Integer soLuongSanPham) {
        this.soLuongSanPham = soLuongSanPham;
    }

    public java.sql.Timestamp getNgayTao() {
        return this.ngayTao;
    }

    public void setNgayTao(java.sql.Timestamp ngayTao) {
        this.ngayTao = ngayTao;
    }

    public java.sql.Timestamp getLanSuaCuoi() {
        return this.lanSuaCuoi;
    }

    public void setLanSuaCuoi(java.sql.Timestamp lanSuaCuoi) {
        this.lanSuaCuoi = lanSuaCuoi;
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
