package com.example.be.repository;

import com.example.be.dto.request.voucher.PhieuGiamGiaRequest;
import com.example.be.dto.response.PhieuGiamGiaResponse;
import com.example.be.entity.PhieuGiamGia;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PhieuGiamGiaRepository extends JpaRepository<PhieuGiamGia,Integer> {
    @Query(value = """
             SELECT v.id AS id,
                   ROW_NUMBER() OVER(ORDER BY v.ngay_tao DESC) AS indexs,
                   v.ma AS ma, v.ten AS ten,
                   v.so_luong AS soLuong,
                   v.loai AS loai,
                   v.gia_tri_hoa_don_duoc_giam AS giaTriGiam,
                   v.gia_tri_hoa_don_duoc_ap_dung AS giaTriToiDa,
                   v.ngay_bat_dau AS ngayBatDau,
                   v.hinh_thuc_giam AS kieuGiam,
                   v.ngay_ket_thuc AS ngayKetThuc,
                   v.trang_thai AS trangThai
            FROM phieu_giam_gia v JOIN phieu_giam_gia_khach_hang av ON v.id = av.id_phieu_giam_gia
            WHERE av.id_khach_hang = :idAccount
            And (:#{#req.ten} IS NULL OR v.ten LIKE CONCAT(%:#{#req.ten}%) 
            OR v.ma LIKE CONCAT(%:#{#req.ma}%))
            
            """, nativeQuery = true)
    List<PhieuGiamGiaResponse> getAccountVoucher(@Param("idAccount") Integer idAccount, @Param("req") PhieuGiamGiaRequest request);

    @Query(value = """
            SELECT v.id AS id,
                   ROW_NUMBER() OVER(ORDER BY v.ngay_tao DESC) AS indexs,
                   v.ma AS ma, v.ten AS ten,
                   v.so_luong AS soLuong,
                   v.loai AS loai,
                   v.gia_tri_hoa_don_duoc_giam AS giaTriGiam,
                   v.gia_tri_hoa_don_duoc_ap_dung AS giaTriToiDa,
                   v.ngay_bat_dau AS ngayBatDau,
                   v.hinh_thuc_giam AS kieuGiam,
                   v.ngay_ket_thuc AS ngayKetThuc,
                   v.trang_thai AS trangThai
            FROM phieu_giam_gia v 
            WHERE (:#{#req.ten} IS NULL OR v.ten LIKE CONCAT( %:#{#req.ten}%) 
            OR v.ma LIKE CONCAT(%:#{#req.ma}%))
             AND (:#{#req.trangThai} IS NULL OR v.trang_thai LIKE CONCAT(%:#{#req.trangThai}%))
            """, nativeQuery = true)
    List<PhieuGiamGiaResponse> getPublicVoucher(@Param("req") PhieuGiamGiaRequest request);

    @Query(value = """
               SELECT v.id AS id,
                   ROW_NUMBER() OVER(ORDER BY v.ngay_tao DESC) AS indexs,
                   v.ma AS ma, v.ten AS ten,
                   v.so_luong AS soLuong,
                   v.loai AS loai,
                   v.gia_tri_hoa_don_duoc_giam AS giaTriGiam,
                   v.gia_tri_hoa_don_duoc_ap_dung AS giaTriToiDa,
                   v.ngay_bat_dau AS ngayBatDau,
                   v.hinh_thuc_giam AS kieuGiam,
                   v.ngay_ket_thuc AS ngayKetThuc,
                   v.trang_thai AS trangThai
            FROM phieu_giam_gia v
            WHERE v.id = :id
            """, nativeQuery = true)
    PhieuGiamGiaResponse getOneVoucher(@Param("id") Integer id);

    @Query(value = """
            SELECT v.id AS id,
                   ROW_NUMBER() OVER(ORDER BY v.ngay_tao DESC) AS indexs,
                   v.ma AS ma, 
                   v.ten AS ten,
                   v.loai AS loai,
                   v.so_luong AS soLuong,
                   v.gia_tri_hoa_don_duoc_giam AS giaTriGiam,
                   v.gia_tri_hoa_don_duoc_ap_dung AS giaTriToiDa,
                   v.ngay_bat_dau AS ngayBatDau,
                   v.hinh_thuc_giam AS kieuGiam,
                   v.ngay_ket_thuc AS ngayKetThuc,
                   v.trang_thai AS trangThai
            FROM phieu_giam_gia v
            WHERE (:#{#req.ten} IS NULL OR v.ten LIKE CONCAT(%:#{#req.ten}%) 
            OR v.ma LIKE CONCAT(%:#{#req.ma}%))
              AND (:#{#req.trangThai} IS NULL OR v.trang_thai = :#{#req.trangThai})
            """, nativeQuery = true)
    Page<PhieuGiamGiaResponse> getAllVoucher(@Param("req") PhieuGiamGiaRequest request, Pageable pageable);

    Boolean existsByMa(String ma);
}
