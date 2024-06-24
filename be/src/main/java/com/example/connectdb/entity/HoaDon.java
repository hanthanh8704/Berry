package com.example.connectdb.entity;

import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Data
@Builder
@Entity
@Table(name = "hoa_don")
public class HoaDon {
    @Id
    @Column(name = "id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;
    @ManyToOne
    @JoinColumn(name = "id_nhan_vien")
    private NhanVien nhanVien;

    @ManyToOne
    @JoinColumn(name = "id_khach_hang")
    private KhachHang khachHang;
    @ManyToOne
    @JoinColumn(name = "id_hinh_thuc_thanh_toan")
    private ThanhToan thanhToan;

    @Column(name = "ma")
    private String ma;

    @Column(name = "ten_nguoi_nhan")
    private String tenNguoiNhan;

    @Column(name = "tong_tien")
    private BigDecimal tongTien;

    @Column(name = "phi_ship")
    private BigDecimal phiShip;

    @Column(name = "email_nguoi_nhan")
    private String emailNguoiNhan;

    @Column(name = "so_dien_thoai_nguoi_nhan", length = 20)
    private String soDienThoaiNguoiNhan;

    @Column(name = "trang_thai_hoa_don")
    private String trangThaiHoaDon;

    @Column(name = "trang_thai_giao_hang")
    private String trangThaiGiaoHang;

    @Column(name = "ngay_giao_dich")
    private Timestamp ngayGiaoDich;

    @Column(name = "ma_giao_dich")
    private Integer maGiaoDich;

    @Column(name = "tong_tien_sau_giam_gia")
    private BigDecimal tongTienSauGiamGia;

    @Column(name = "dia_chi")
    private String diaChi;

    @Column(name = "ghi_chu")
    private String ghiChu;
    @CreationTimestamp
    @Column(name = "ngay_tao")
    private Timestamp ngayTao;
    @UpdateTimestamp
    @Column(name = "ngay_sua")
    private Timestamp ngaySua;

    @Column(name = "nguoi_tao")
    private String nguoiTao;

    @Column(name = "nguoi_sua")
    private String nguoiSua;
}
