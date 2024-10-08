//package com.poly.backend.entity.client;
//
//import com.poly.backend.entity.KhachHang;
//import jakarta.persistence.*;
//import lombok.*;
//import org.hibernate.annotations.CreationTimestamp;
//import org.springframework.data.annotation.CreatedDate;
//
//import java.time.LocalDateTime;
//
//@Data
//@AllArgsConstructor
//@NoArgsConstructor
//@Entity
//@Builder
//@Table(name = "gio_hang")
//public class GioHang {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "id")
//    private Integer id;
//    @ManyToOne
//    @JoinColumn(name = "id_khach_hang")
//    private KhachHang khachHang;
//    @Column(name = "ma")
//    private String ma;
//
//    @CreatedDate
//    @Column(name = "ngay_tao", updatable = false)
//    private LocalDateTime ngayTao;
//    @Column(name = "trang_thai")
//    private String trangThai;
//}
