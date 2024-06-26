package com.example.TuHocFullStack.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "chi_tiet_san_pham")
public class SPCT {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_mau_sac")
    private MauSac idMauSac;

    @ManyToOne
    @JoinColumn(name = "id_chat_lieu")
    private ChatLieu idChatLieu;

    @ManyToOne
    @JoinColumn(name = "id_kich_co")
    private KichCo idKichCo;
    @ManyToOne
    @JoinColumn(name = "id_san_pham")
    private SanPham idSanPham;
    @ManyToOne
    @JoinColumn(name = "id_thuong_hieu")
    private ThuongHieu idThuongHieu;
    @ManyToOne
    @JoinColumn(name = "id_anh")
    private Anh idAnh;
    @Column(name = "so_luong")
    private Integer soLuong;
    @Column(name = "gia_ban")
    private BigDecimal giaBan;
    @Column(name = "gia_nhap")
    private BigDecimal giaNhap;
    @CreationTimestamp
    @Column(name = "ngay_tao")
    private LocalDateTime ngayTao;
    @UpdateTimestamp
    @Column(name = "ngay_sua")
    private LocalDateTime ngaySua;
    @Column(name = "trang_thai")
    private String trangThai;
    @Column(name = "nguoi_tao")
    private String nguoiTao;

    @Column(name = "nguoi_sua")
    private String nguoiSua;
}
