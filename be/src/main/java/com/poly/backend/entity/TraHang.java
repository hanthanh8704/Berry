//package com.poly.backend.entity;
//
//import jakarta.persistence.*;
//import lombok.*;
//import org.hibernate.annotations.CreationTimestamp;
//
//import java.math.BigDecimal;
//import java.time.LocalDateTime;
//
//@Getter
//@Setter
//@AllArgsConstructor
//@NoArgsConstructor
//@Entity
//@Builder
//@Table(name = "tra_hang")
//public class TraHang {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "id")
//    private Integer id;
//    @ManyToOne
//    @JoinColumn(name = "id_nhan_vien")
//    private NhanVien nhanVien;
//    @ManyToOne
//    @JoinColumn(name = "id_hoa_don")
//    private HoaDon hoaDon;
//    @ManyToOne
//    @JoinColumn(name = "id_chi_tiet_san_pham")
//    private SPCT spct;
//    @Column(name = "so_luong")
//    private Integer soLuong;
//    @Column(name = "gia_ban")
//    private BigDecimal giaBan;
//    @Column(name = "tong_tien")
//    private BigDecimal tongTien;
//    @Column(name = "ly_do")
//    private String lyDo;
//    @CreationTimestamp
//    @Column(name = "ngay_tra")
//    private LocalDateTime ngayTra;
//    @Column(name = "trang_thai")
//    private String trangThai;
//
//
//}
