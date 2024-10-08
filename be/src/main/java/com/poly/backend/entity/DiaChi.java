//package com.poly.backend.entity;
//
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//import org.hibernate.annotations.CreationTimestamp;
//import org.hibernate.annotations.UpdateTimestamp;
//import org.springframework.data.annotation.CreatedDate;
//import org.springframework.data.annotation.LastModifiedDate;
//
//import java.time.LocalDateTime;
//
//@Getter
//@Setter
//@AllArgsConstructor
//@NoArgsConstructor
//@Entity
//@Table(name = "dia_chi")
//public class DiaChi {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "id")
//    private Integer id;
//    @ManyToOne
//    @JoinColumn(name = "id_khach_hang")
//    private KhachHang khachHang;
//    @Column(name = "ho_ten")
//    private String hoTen;
//    @Column(name = "so_dien_thoai")
//    private String soDienThoai;
//    @Column(name = "dia_chi_mac_dinh")
//    private Boolean diaChiMacDinh;
//    @Column(name = "thanh_pho")
//    private String thanhPho;
//    @Column(name = "huyen")
//    private String huyen;
//    @Column(name = "phuong")
//    private String phuong;
//    @Column(name = "dia_chi_cu_the")
//    private String diaChiCuThe;
//    @Column(name = "trang_thai")
//    private String trangThai;
//    @CreationTimestamp
//    @CreatedDate
//    @Column(name = "ngay_tao", updatable = false)
//    private LocalDateTime ngayTao;
//    @UpdateTimestamp
//    @LastModifiedDate
//    @Column(name = "ngay_sua")
//    private LocalDateTime ngaySua;
//    @Column(name = "nguoi_tao")
//    private String nguoiTao;
//    @Column(name = "nguoi_sua")
//    private String nguoiSua;
//    @Column(name = "deleted")
//    private Boolean deleted;
//}
