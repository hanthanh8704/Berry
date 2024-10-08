//package com.poly.backend.entity;
//
//
//import jakarta.persistence.*;
//import lombok.*;
//
//import java.math.BigDecimal;
//import java.sql.Timestamp;
//
//@Getter
//@Setter
//@AllArgsConstructor
//@NoArgsConstructor
//@Data
//@Builder
//@Entity
//@Table(name = "hoa_don_chi_tiet")
//public class HoaDonChiTiet {
//    @Id
//    @Column(name = "id")
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    private Integer id;
//    @ManyToOne
//    @JoinColumn(name = "id_hoa_don")
//    private HoaDon hoaDon;
//    @ManyToOne
//    @JoinColumn(name = "id_chi_tiet_san_pham")
//    private SPCT chiTietSanPham;
//
//    @Column(name = "so_luong")
//    private Integer soLuong;
//
//    @Column(name = "don_gia")
//    private BigDecimal donGia;
//
//    @Column(name = "trang_thai")
//    private String trangThai;
//
//    @Column(name = "ngay_tao")
//    private Timestamp ngayTao;
//
//    @Column(name = "ngay_sua")
//    private Timestamp ngaySua;
//
//    @Column(name = "nguoi_tao")
//    private String nguoiTao;
//
//    @Column(name = "nguoi_sua")
//    private String nguoiSua;
//}
//
