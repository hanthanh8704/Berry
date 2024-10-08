//package com.poly.backend.entity;
//
//import com.fasterxml.jackson.annotation.JsonIgnore;
//import jakarta.persistence.*;
//import lombok.AllArgsConstructor;
//import lombok.Getter;
//import lombok.NoArgsConstructor;
//import lombok.Setter;
//import org.hibernate.annotations.CreationTimestamp;
//import org.hibernate.annotations.UpdateTimestamp;
//
//import java.math.BigDecimal;
//import java.time.LocalDateTime;
//@Getter
//@Setter
//@AllArgsConstructor
//@NoArgsConstructor
//@Entity
//@Table(name = "spct_khuyen_mai")
//public class DotGiamGiaDetail {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "id")
//    private Integer id;
//    @ManyToOne
//    @JoinColumn(name = "id_dot_giam_gia")
//    private DotGiamGia idDotGiamGia;
//    @ManyToOne
//    @JoinColumn(name = "id_chi_tiet_san_pham")
//    @JsonIgnore
//    private SPCT idSPCT;
//    @Column(name = "gia_cu")
//    private BigDecimal giaCu;
//    @Column(name = "gia_moi")
//    private BigDecimal giaMoi;
//    @Column(name = "giam_gia")
//    private BigDecimal giaGiam;
//    @Column(name = "trang_thai")
//    private String trangThai;
//    @Column(name = "ngay_bat_dau")
//    private LocalDateTime ngayBatDau;
//    @Column(name = "ngay_ket_thuc")
//    private LocalDateTime ngayKetThuc;
//
//    @CreationTimestamp
//    @Column(name = "ngay_tao", updatable = false)
//    private LocalDateTime ngayTao;
//    @UpdateTimestamp
//    @Column(name = "ngay_sua")
//    private LocalDateTime ngaySua;
//
//}
