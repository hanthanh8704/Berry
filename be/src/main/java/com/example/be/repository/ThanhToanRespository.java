package com.example.be.repository;

import com.example.be.dto.response.ThanhToanResponse;
import com.example.be.entity.ThanhToan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ThanhToanRespository extends JpaRepository<ThanhToan, Integer> {
    @Query(value = """
            SELECT 
              ROW_NUMBER() OVER(ORDER BY tt.ngay_tao ASC) AS indexs,
              tt.id AS id,
              tt.ma_giao_dich AS maGiaoDich,
              tt.ngay_tao AS NgayTao,
              tt.ten_hinh_thuc AS TenHinhThuc,
              tt.tong_tien_thanh_toan AS TongTienThanhToan,
              tt.trang_thai AS trangThai,
              tt.nguoi_tao AS nguoiTao,
              tt.ghi_chu AS ghiChu
             FROM thanh_toan tt 
            LEFT JOIN hoa_don hd ON hd.id = tt.id_hoa_don
                            WHERE hd.id = :idHoaDon
                        """, nativeQuery = true)
    List<ThanhToanResponse> getThanhToanByIdHoaDon(@Param("idHoaDon")Integer idHoaDon);

    // Tìm các PTTT có idHoaDon và tên HT
    @Query(value = """
            SELECT 
              ROW_NUMBER() OVER(ORDER BY tt.ngay_tao ASC) AS indexs,
              tt.id AS id,
              tt.ma_giao_dich AS maGiaoDich,
              tt.ngay_tao AS NgayTao,
              tt.ten_hinh_thuc AS TenHinhThuc,
              tt.tong_tien_thanh_toan AS TongTienThanhToan,
              tt.trang_thai AS trangThai,
              tt.nguoi_tao AS nguoiTao,
              tt.ghi_chu AS ghiChu
             FROM thanh_toan tt 
            LEFT JOIN hoa_don hd ON hd.id = tt.id_hoa_don
            WHERE hd.id = :idHoaDon AND tt.ten_hinh_thuc = :tenHinhThuc
            """, nativeQuery = true)
    List<ThanhToan> findByHoaDonIdAndTenHinhThuc(Integer idHoaDon, String tenHinhThuc);
}
