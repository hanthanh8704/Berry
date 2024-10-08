//package com.poly.backend.entity;
//import jakarta.persistence.*;
//import lombok.*;
//import org.antlr.v4.runtime.misc.NotNull;
//import org.hibernate.annotations.CreationTimestamp;
//import org.hibernate.annotations.UpdateTimestamp;
//import org.springframework.data.annotation.CreatedBy;
//import org.springframework.data.annotation.CreatedDate;
//import org.springframework.data.annotation.LastModifiedBy;
//import org.springframework.data.annotation.LastModifiedDate;
//import java.time.LocalDateTime;
//
//@Getter
//@Setter
//@AllArgsConstructor
//@NoArgsConstructor
//@Entity
//@Builder
//@Table(name = "dot_giam_gia")
//public class DotGiamGia {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "id")
//    private Integer id;
//    @Column(name = "ma")
//    private String ma;
//    @Column(name = "ten")
//    private String ten;
//    @Column(name = "gia_tri_giam")
//    private Integer giaTriGiam;
//    @Column(name = "trang_thai")
//    private String trangThai;
//
//    @Column(name = "ngay_bat_dau")
//    private LocalDateTime ngayBatDau;
//
//    @Column(name = "ngay_ket_thuc")
//    private LocalDateTime ngayKetThuc;
//    @CreationTimestamp
//    @CreatedDate
//    @Column(name = "ngay_tao", updatable = false)
//    private LocalDateTime ngayTao;
//    @UpdateTimestamp
//    @LastModifiedDate
//    @Column(name = "ngay_sua")
//    private LocalDateTime ngaySua;
//    @CreatedBy
//    @Column(name = "nguoi_tao")
//    private String nguoiTao;
//    @LastModifiedBy
//    @Column(name = "nguoi_sua")
//    private String nguoiSua;
//    @Column(name = "deleted")
//    private Boolean deleted;
//}
