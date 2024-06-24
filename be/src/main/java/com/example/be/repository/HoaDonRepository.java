package com.example.be.repository;

import com.example.be.dto.request.bill.HoaDonRequest;
import com.example.be.entity.HoaDon;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Timestamp;
@Repository
public interface HoaDonRepository extends JpaRepository<HoaDon, Integer> {

    @Query(value = """
            SELECT 
                hd.id AS id,
                ROW_NUMBER() OVER(ORDER BY hd.ngaySua DESC) AS indexs,
                hd.ma AS ma,
                nv.ten AS tenNhanVien, 
                kh.hoTen AS tenKhachHang, 
                tt.hinhThucThanhToan AS tenHinhThucThanhToan, 
                hd.ngayGiaoDich AS ngayGiaoDich,
                hd.trangThaiHoaDon AS trangThaiHoaDon,
                hd.tongTien AS tongTien,
                hd.ngayTao AS ngayTao,
                hd.ngaySua AS ngaySua,
                hd.ghiChu AS ghiChu
            FROM HoaDon hd
            JOIN hd.nhanVien nv
            JOIN hd.khachHang kh
            JOIN hd.thanhToan tt
            WHERE (:#{#req.ma} IS NULL OR hd.ma LIKE %:#{#req.ma}%)
              AND (:#{#req.tenNhanVien} IS NULL OR nv.ten LIKE %:#{#req.tenNhanVien}%)
              AND (:#{#req.tenKhachHang} IS NULL OR kh.hoTen LIKE %:#{#req.tenKhachHang}%)
              AND (:ngayGiaoDichFrom IS NULL OR :ngayGiaoDichTo IS NULL OR (hd.ngayGiaoDich BETWEEN :ngayGiaoDichFrom AND :ngayGiaoDichTo))
              AND hd.trangThaiHoaDon = 'đã thanh toán'
            """)
    Page<HoaDon> getAllHoaDon(@Param("req") HoaDonRequest req,
                              @Param("ngayGiaoDichFrom") Timestamp ngayGiaoDichFrom,
                              @Param("ngayGiaoDichTo") Timestamp ngayGiaoDichTo,
                              Pageable pageable);
}
