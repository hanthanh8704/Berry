//package com.poly.backend.entity.client;
//
//import com.poly.backend.entity.KhachHang;
//import com.poly.backend.entity.SPCT;
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;
//import org.hibernate.annotations.CreationTimestamp;
//import org.hibernate.annotations.UpdateTimestamp;
//import org.springframework.data.annotation.CreatedBy;
//import org.springframework.data.annotation.CreatedDate;
//import org.springframework.data.annotation.LastModifiedBy;
//import org.springframework.data.annotation.LastModifiedDate;
//
//import java.time.LocalDateTime;
//
//@Data
//@AllArgsConstructor
//@NoArgsConstructor
//@Entity
//@Table(name = "gio_hang_chi_tiet")
//public class GioHangChiTiet {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "id")
//    private Integer id;
//    @ManyToOne
//    @JoinColumn(name = "id_gio_hang")
//    private GioHang gioHang;
//    @ManyToOne
//    @JoinColumn(name = "id_chi_tiet_san_pham")
//    private SPCT chiTietSanPham;
//    @Column(name = "so_luong_san_pham")
//    private Integer soLuong;
//    @CreationTimestamp
//    @CreatedDate
//    @Column(name = "ngay_tao", updatable = false)
//    private LocalDateTime ngayTao;
//    @UpdateTimestamp
//    @LastModifiedDate
//    @Column(name = "lan_sua_cuoi")
//    private LocalDateTime ngaySua;
//    @CreatedBy
//    @Column(name = "nguoi_tao")
//    private String nguoiTao;
//    @LastModifiedBy
//    @Column(name = "nguoi_sua")
//    private String nguoiSua;
//
//
//}
