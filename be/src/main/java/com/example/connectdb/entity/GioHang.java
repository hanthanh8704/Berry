package com.example.connectdb.entity;

import javax.persistence.*;

@Entity
@Table(name = "gio_hang")
public class GioHang {
    @Id
    @Column(name = "id")
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "id_khach_hang")
    private KhachHang khachHang;

    @Column(name = "ma")
    private String ma;

    @Column(name = "ngay_tao")
    private java.sql.Timestamp ngayTao;

    @Column(name = "trang_thai")
    private Integer trangThai;

    @Column(name = "ngay_thanh_toan")
    private java.sql.Timestamp ngayThanhToan;
}
