package com.example.be.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "dia_chi")
public class DiaChi {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "id_khach_hang")
    @JsonIgnore
    private KhachHang idKhachHang;

    @Column(name = "ho_ten")
    private String hoTen;

    @Column(name = "so_dien_thoai")
    private String soDienThoai;

    @Column(name = "thanh_pho")
    private String thanhPho;

    @Column(name = "huyen")
    private String huyen;

    @Column(name = "phuong")
    private String phuong;

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
    @Column(name = "dia_chi_cu_the")
    private String diaChiCuThe;

    @Column(name = "dia_chi_mac_dinh")
    private Boolean diaChiMacDinh;
    @Column(name = "deleted")
    private boolean deleted;
}
