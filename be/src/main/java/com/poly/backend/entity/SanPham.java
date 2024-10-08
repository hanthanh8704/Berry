//package com.poly.backend.entity;
//
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//import org.hibernate.annotations.CreationTimestamp;
//import org.hibernate.annotations.UpdateTimestamp;
//import org.springframework.data.annotation.CreatedBy;
//import org.springframework.data.annotation.CreatedDate;
//import org.springframework.data.annotation.LastModifiedBy;
//import org.springframework.data.annotation.LastModifiedDate;
//
//import java.time.LocalDateTime;
//import java.util.List;
//
//@Getter
//@Setter
//@AllArgsConstructor
//@NoArgsConstructor
//@Entity
//@Table(name = "san_pham")
//public class SanPham {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "id")
//    private Integer id;
//    @Column(name = "ten")
//    private String ten;
//    @Column(name = "soLuong")
//    private Integer soLuong;
//    @Column(name = "ma")
//    private String ma;
//    @ManyToOne
//    @JoinColumn(name = "id_danh_muc")
//    private DanhMuc danhMuc;
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
//    @CreatedBy
//    @Column(name = "nguoi_tao")
//    private String nguoiTao;
//    @LastModifiedBy
//    @Column(name = "nguoi_sua")
//    private String nguoiSua;
//    @Column(name = "deleted")
//    private Boolean deleted;
//
////    @OneToMany(mappedBy = "idSanPham")
////    private List<SPCT> listSPCT;
//}
