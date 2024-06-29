package com.example.connectdb.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "spct_khuyen_mai")
public class SpctKhuyenMai {
    @Id
    @Column(name = "id")
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "id_dot_giam_gia")
    private DotGiamGia dotGiamGia;
    @ManyToOne
    @JoinColumn(name = "id_san_pham_chi_tiet")
    private ChiTietSanPham chiTietSanPham;

    @Column(name = "gia_cu")
    private BigDecimal giaCu;

    @Column(name = "gia_moi")
    private BigDecimal giaMoi;

    @Column(name = "giam_gia")
    private BigDecimal giamGia;

    @Column(name = "ngay_tao")
    private Timestamp ngayTao;

    @Column(name = "ngay_sua")
    private Timestamp ngaySua;

    @Column(name = "ngay_bat_dau")
    private Timestamp ngayBatDau;

    @Column(name = "ngay_ket_thuc")
    private Timestamp ngayKetThuc;

    @Column(name = "trang_thai")
    private String trangThai;

}
