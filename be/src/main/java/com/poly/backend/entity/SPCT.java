//package com.poly.backend.entity;
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
//import java.util.List;
//
//@Getter
//@Setter
//@AllArgsConstructor
//@NoArgsConstructor
//@Entity
//@Table(name = "chi_tiet_san_pham")
//public class SPCT {
//    @Id
//    @GeneratedValue(strategy = GenerationType.IDENTITY)
//    @Column(name = "id")
//    private Integer id;
//
//    @Column(name = "maCTSP")
//    private String ma;
//    @ManyToOne
//    @JoinColumn(name = "id_mau_sac")
//    private MauSac idMauSac;
//
//    @ManyToOne
//    @JoinColumn(name = "id_chat_lieu")
//    private ChatLieu idChatLieu;
//
//    @ManyToOne
//    @JoinColumn(name = "id_kich_co")
//    private KichCo idKichCo;
//    @ManyToOne
////    @JsonIgnore
//    @JoinColumn(name = "id_san_pham")
//    private SanPham idSanPham;
//    @ManyToOne
//    @JoinColumn(name = "id_thuong_hieu")
//    private ThuongHieu idThuongHieu;
//
//    @ManyToOne
//    @JoinColumn(name = "id_tay_ao")
//    private TayAo idTayAo;
//    @ManyToOne
//    @JoinColumn(name = "id_co_ao")
//    private CoAo idCoAo;
//    @Column(name = "so_luong")
//    private Integer soLuong;
//    @Column(name = "gia_ban")
//    private BigDecimal giaBan;
//    @Column(name = "gia_moi")
//    private BigDecimal giaMoi;
//    @Column(name = "phan_tram_giam")
//    private Integer phanTramGiam;
//    @CreationTimestamp
//    @Column(name = "ngay_tao")
//    private LocalDateTime ngayTao;
//    @UpdateTimestamp
//    @Column(name = "ngay_sua")
//    private LocalDateTime ngaySua;
//    @Column(name = "trang_thai")
//    private String trangThai;
//    @Column(name = "nguoi_tao")
//    private String nguoiTao;
//
//    @Column(name = "nguoi_sua")
//    private String nguoiSua;
//    @OneToMany(mappedBy = "idchiTietSanPham", fetch = FetchType.LAZY)
//    private List<Anh> anhList;  // Thêm trường này để lưu danh sách ảnh liên quan
//
////    @OneToMany(mappedBy = "idSPCT", fetch = FetchType.LAZY)
////    private List<DotGiamGiaDetail> giaCuDGGDetail;
//
//}
