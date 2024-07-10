package com.example.be.entity;


import jakarta.persistence.*;
import lombok.*;

import java.util.Date;
import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "nhan_vien")
public class NhanVien {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "id_chuc_vu")
    private ChucVu chucVu;
    @Column(name = "anh")
    private String anh;
    @Column(name = "ma")
    private String ma;

    @Column(name = "ten")
    private String ten;

    @Column(name = "dia_chi")
    private String diaChi;

    @Column(name = "ngay_sinh")
    private Date ngaySinh;

    @Column(name = "so_dien_thoai")
    private String soDienThoai;

    @Column(name = "gioi_tinh")
    private String gioiTinh;

    @Column(name = "email")
    private String email;

    @Column(name = "cccd")
    private String cccd;

    @Column(name = "trang_thai")
    private String trangThai;

    @Column(name = "ngay_tao")
    private Timestamp ngayTao;

    @Column(name = "ngay_sua")
    private Timestamp ngaySua;

    @Column(name = "nguoi_tao")
    private String nguoiTao;

    @Column(name = "nguoi_sua")
    private String nguoiSua;

    @Column(name = "deleted")
    private Boolean deleted;

    @OneToOne
    @JoinColumn(name = "account_id", referencedColumnName = "email")
    private Account account;
}