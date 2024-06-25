package com.example.be.repository;

import com.example.be.dto.request.bill.HoaDonSearchRequest;
import com.example.be.dto.response.HoaDonResponse;
import com.example.be.dto.response.TKHoaDonTrangThai;
import com.example.be.entity.HoaDon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HoaDonRepository extends JpaRepository<HoaDon, Integer> {
    @Query(value = """
            SELECT
                hd.id AS id,
                ROW_NUMBER() OVER(ORDER BY hd.ngay_sua DESC) AS indexs,
                hd.ma AS ma,
                nv.ten AS nhanVien,
                kh.ho_ten AS khachHang,
                tt.ten_hinh_thuc AS thanhToan,
                hd.loai_hoa_don AS loaiHoaDon,
                hd.ten_nguoi_nhan AS tenNguoiNhan,
                hd.tong_tien AS tongTien,
                hd.phi_ship AS phiShip,
                hd.email_nguoi_nhan AS emailNguoiNhan,
                hd.so_dien_thoai_nguoi_nhan AS soDienThoaiNguoiNhan,
                hd.trang_thai_hoa_don AS trangThaiHoaDon,
                hd.trang_thai_giao_hang AS trangThaiGiaoHang,
                hd.ngay_giao_hang AS ngayGiaoHang,
                hd.ngay_nhan_hang AS ngayNhanHang,
                hd.ma_giao_dich AS maGiaoDich,
                hd.tong_tien_sau_giam_gia AS tongTienSauGiamGia,
                hd.dia_chi AS diaChi,
                hd.ghi_chu AS ghiChu,
                hd.ngay_tao AS ngayTao,
                hd.ngay_sua AS ngaySua,
                hd.nguoi_tao AS nguoiTao,
                hd.nguoi_sua AS nguoiSua
            FROM hoa_don hd
            LEFT JOIN nhan_vien nv ON hd.id_nhan_vien = nv.id
            LEFT JOIN khach_hang kh ON hd.id_khach_hang = kh.id
            LEFT JOIN thanh_toan tt ON hd.id_hinh_thuc_thanh_toan = tt.id
            WHERE (:#{#req.ma} IS NULL OR hd.ma LIKE %:#{#req.ma}%)
              AND (:#{#req.trangThaiHoaDon} IS NULL OR hd.trang_thai_hoa_don = :#{#req.trangThaiHoaDon})
              AND (:#{#req.fromDate} IS NULL OR :#{#req.toDate} IS NULL OR (hd.ngay_sua BETWEEN :#{#req.fromDate} AND :#{#req.toDate}))
            """, nativeQuery = true)
    Page<HoaDonResponse> getAllHoaDon(@Param("req") HoaDonSearchRequest req, Pageable pageable);

    // Hàm này dùng để thống kê hóa đơn theo trạng thái
    @Query(value = """
            SELECT
               CASE
                   WHEN trang_thai_hoa_don = 'Chờ xác nhận' THEN 'Chờ xác nhận'
                   WHEN trang_thai_hoa_don = 'Xác nhận thông tin thanh toán' THEN 'Xác nhận thông tin thanh toán'
                   WHEN trang_thai_hoa_don = 'Chờ giao' THEN 'Chờ giao'
                   WHEN trang_thai_hoa_don = 'Đang giao' THEN 'Đang giao'
                   WHEN trang_thai_hoa_don = 'Hoàn thành' THEN 'Hoàn thành'
                   ELSE 'Chờ thanh toán'
               END AS ten_trang_thai,
               trang_thai_hoa_don as trang_thai,
               COUNT(*) AS totalCount
            FROM hoa_don b
            WHERE b.trang_thai_hoa_don NOT IN ('Chờ thanh toán')
            GROUP BY ten_trang_thai, trang_thai_hoa_don
            ORDER BY trang_thai_hoa_don
                   """, nativeQuery = true)
    List<TKHoaDonTrangThai> getHoaDonByTrangThai();


    // Hàm này dùng để lấy ra danh sách các hóa đơn mới
//    @Query("""
//            SELECT b
//            FROM HoaDon b
//            WHERE (:#{#req.ma} IS NULL OR b.ma LIKE %:#{#req.ma}%)
//            AND (:#{#req.idNhanVien} IS NULL OR b.nhanVien.id = :#{#req.idNhanVien})
//            AND (:#{#req.trangThaiHoaDon} IS NULL OR b.trangThaiHoaDon = :#{#req.trangThaiHoaDon})
//            AND b.trangThaiHoaDon = 'Hoàn thành'
//            ORDER BY b.ngayTao DESC
//            """)
//    List<HoaDon>getNewHoaDon(@Param("req") HoaDonSearchRequest request);

    // Hàm này dùng để lấy danh sách các hóa đơn của một tài khoản nhân viên dựa trên idNhanVien và trạng thái
    Page<HoaDon> findByNhanVienIdAndTrangThaiHoaDon(Integer idHoaDon, String trangThai, Pageable pageable);

    // Hàm này dùng để tìm kiếm hóa đơn theo mã
    HoaDon findByMa(String ma);

    // Kiểm tra xem hóa đơn đó có tồn tại hay không
    Boolean existsByMa(String ma);


}

