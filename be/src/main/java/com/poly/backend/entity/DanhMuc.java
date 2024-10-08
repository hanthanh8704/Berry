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
//@Table(name = "danh_muc")
//public class DanhMuc {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "id")
//    private Integer id;
//    @Column(name = "ten")
//    private String ten;
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
//
//}
