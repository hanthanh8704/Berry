package com.example.be.repository;

import com.example.be.dto.response.LichSuHoaDonResponse;
import com.example.be.entity.LichSuHoaDon;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LichSuHoaDonRepository extends JpaRepository<LichSuHoaDon,Integer> {
    @Query(value = """
            SELECT ROW_NUMBER() OVER(ORDER BY lshd.ngay_tao ASC) AS indexs,
                   lshd.id AS id,
                   hd.ma AS hoaDon,
                   nv.ten AS nhanVien,
                   lshd.ghi_chu AS ghiChu,
                   lshd.trang_thai AS trangThai,
                   lshd.ngay_tao AS ngayTao,
                   lshd.ngay_sua AS ngaySua
            FROM lich_su_hoa_don lshd
            LEFT JOIN hoa_don hd ON lshd.id_hoa_don = hd.id
            LEFT JOIN nhan_vien nv ON lshd.id_nhan_vien = nv.id
            WHERE lshd.id_hoa_don = :idHoaDon
            """, nativeQuery = true)
    List<LichSuHoaDonResponse> getByBill(@Param("idHoaDon") Integer idHoaDon);
}
