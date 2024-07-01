package com.example.be.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
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
    @JoinColumn(name = "id_phieu_giam_gia")
    private PhieuGiamGia phieuGiamGia;

    @ManyToOne
    @JoinColumn(name = "id_khach_hang")
    private KhachHang khachHang;

    @ManyToOne
    @JoinColumn(name = "id_hinh_thuc_thanh_toan")
    private ThanhToan thanhToan;

    @Column(name = "ma")
    private String ma;

    @Column(name = "loai_hoa_don")
    private String loaiHoaDon;

    @Column(name = "ten_nguoi_nhan")
    private String tenNguoiNhan;

    @Column(name = "so_tien_duoc_giam")
    private BigDecimal soTienDuocGiam;

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

    @Column(name = "ngay_giao_hang")
    private Timestamp ngayGiaoHang;

    @Column(name = "ngay_nhan_hang")
    private Timestamp ngayNhanHang;

    @Column(name = "ma_giao_dich")
    private Integer maGiaoDich;

    @Column(name = "tong_tien_sau_giam_gia")
    private BigDecimal tongTienSauGiamGia;

    @Column(name = "dia_chi")
    private String diaChi;

    @Column(name = "ghi_chu")
    private String ghiChu;

    @CreationTimestamp
    @Column(name = "ngay_tao", updatable = false)
    private Timestamp ngayTao;

    @UpdateTimestamp
    @Column(name = "ngay_sua")
    private Timestamp ngaySua;

    @Column(name = "nguoi_tao")
    private String nguoiTao;

    @Column(name = "nguoi_sua")
    private String nguoiSua;
}
