package com.example.connectdb.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
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
@Table(name = "phieu_giam_gia")
public class PhieuGiamGia {
    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "ma")
    private String ma;

    @Column(name = "ten")
    private String ten;

    @Column(name = "so_luong")
    private Integer soLuong;

    @Column(name = "ngay_bat_dau")
    private Timestamp ngayBatDau;

    @Column(name = "ngay_ket_thuc")
    private Timestamp ngayKetThuc;

    @Column(name = "ngay_tao")
    private Timestamp ngayTao;

    @Column(name = "ngay_sua")
    private Timestamp ngaySua;

    @Column(name = "trang_thai")
    private String trangThai;

    @Column(name = "gia_tri_hoa_don_duoc_ap_dung")
    private BigDecimal giaTriHoaDonDuocApDung;

    @Column(name = "gia_tri_hoa_don_duoc_giam")
    private BigDecimal giaTriHoaDonDuocGiam;

    @Column(name = "hinh_thuc_giam")
    private String hinhThucGiam;
}
