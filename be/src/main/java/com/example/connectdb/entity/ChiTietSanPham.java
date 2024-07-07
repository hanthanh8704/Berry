package com.example.connectdb.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "chi_tiet_san_pham")
public class ChiTietSanPham {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;

    @Column(name = "maCTSP")
    private String ma;

    @ManyToOne
    @JoinColumn(name = "id_mau_sac")
    private MauSac mauSac;

    @ManyToOne
    @JoinColumn(name = "id_chat_lieu")
    private ChatLieu chatLieu;

    @ManyToOne
    @JoinColumn(name = "id_tay_ao")
    private TayAo tayAo;

    @ManyToOne
    @JoinColumn(name = "id_co_ao")
    private CoAo coAo;

    @ManyToOne
    @JoinColumn(name = "id_kich_co")
    private KichCo kichCo;

    @ManyToOne
    @JoinColumn(name = "id_san_pham")
    private SanPham sanPham;

    @ManyToOne
    @JoinColumn(name = "id_thuong_hieu")
    private ThuongHieu thuongHieu;


    @Column(name = "so_luong")
    private Integer soLuong;

    @Column(name = "gia_ban")
    private BigDecimal giaBan;


    @Column(name = "ngay_tao")
    @CreationTimestamp
    private Timestamp ngayTao;

    @Column(name = "ngay_sua")
    @UpdateTimestamp
    private Timestamp ngaySua;

    @Column(name = "trang_thai")
    private String trangThai;

    @Column(name = "nguoi_tao")
    private String nguoiTao;

    @Column(name = "nguoi_sua")
    private String nguoiSua;

    @Column(name = "deleted")
    private Boolean deleted;

    @OneToMany(mappedBy = "chiTietSanPham", fetch = FetchType.LAZY)
    private List<Anh> images;
}
