package com.example.connectdb.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "dot_giam_gia")
public class DotGiamGia {
    @Id
    @Column(name = "id")
    private Integer id;

    @Column(name = "ma")
    private String ma;

    @Column(name = "ten")
    private String ten;

    @Column(name = "gia_tri_giam")
    private Integer giaTriGiam;

    @Column(name = "loai_khuyen_mai")
    private String loaiKhuyenMai;

    @Column(name = "trang_thai")
    private Integer trangThai;

    @Column(name = "ngay_bat_dau")
    private Timestamp ngayBatDau;

    @Column(name = "ngay_ket_thuc")
    private Timestamp ngayKetThuc;

    @Column(name = "ngay_tao")
    private Timestamp ngayTao;

    @Column(name = "ngay_sua")
    private Timestamp ngaySua;

    @Column(name = "nguoi_tao")
    private String nguoiTao;

    @Column(name = "nguoi_sua")
    private String nguoiSua;
}
