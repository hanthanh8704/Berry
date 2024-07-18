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
/**
 * @author ninhncph40535
 *
 */
@Repository
public interface PhieuGiamGiaRepository extends JpaRepository<PhieuGiamGia,Integer> {
    @Query(value = """
             SELECT v.id AS id,
                   ROW_NUMBER() OVER(ORDER BY v.ngay_tao DESC) AS indexs,
                   v.ma AS ma, v.ten AS ten,
                   v.so_luong AS soLuong,
                   v.loai AS loai,
                   v.gia_tri_hoa_don_duoc_giam AS giaTriHoaDonDuocGiam,
                   v.gia_tri_hoa_don_duoc_ap_dung AS giaTriHoaDonDuocApDung,
                   v.ngay_bat_dau AS ngayBatDau,
                   v.hinh_thuc_giam AS hinhThucGiam,
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
                   v.gia_tri_hoa_don_duoc_giam AS giaTriHoaDonDuocGiam,
                   v.gia_tri_hoa_don_duoc_ap_dung AS giaTriHoaDonDuocApDung,
                   v.ngay_bat_dau AS ngayBatDau,
                   v.hinh_thuc_giam AS hinhThucGiam,
                   v.ngay_ket_thuc AS ngayKetThuc,
                   v.trang_thai AS trangThai
            FROM phieu_giam_gia v 
            WHERE (:#{#req.ten} IS NULL OR v.ten LIKE CONCAT( %:#{#req.ten}%) 
            OR v.ma LIKE CONCAT(%:#{#req.ma}%))
             AND (:#{#req.trangThai} IS NULL OR v.trang_thai LIKE CONCAT(%:#{#req.trangThai}%))
            """, nativeQuery = true)
    List<PhieuGiamGiaResponse> getPublicVoucher(@Param("req") PhieuGiamGiaRequest request);

    @Query(value = """
               SELECT
                   v.id AS id,
                   ROW_NUMBER() OVER(ORDER BY v.ngay_tao DESC) AS indexs,
                   v.ma AS ma,
                   v.ten AS ten,
                   v.so_luong AS soLuong,
                   v.loai AS loai,
                   v.gia_tri_hoa_don_duoc_giam AS giaTriHoaDonDuocGiam,
                   v.gia_tri_hoa_don_duoc_ap_dung AS giaTriHoaDonDuocApDung,
                   v.ngay_bat_dau AS ngayBatDau,
                   v.hinh_thuc_giam AS hinhThucGiam,
                   v.ngay_ket_thuc AS ngayKetThuc,
                   v.trang_thai AS trangThai,
                   GROUP_CONCAT(pggkh.id_khach_hang) AS customers
               FROM phieu_giam_gia v LEFT JOIN phieu_giam_gia_khach_hang pggkh ON pggkh.id_phieu_giam_gia = v.id
               WHERE v.id =:id
               GROUP BY v.id, v.ma, v.ten, v.so_luong, v.loai, v.gia_tri_hoa_don_duoc_giam,
                   v.gia_tri_hoa_don_duoc_ap_dung, v.ngay_bat_dau, v.hinh_thuc_giam,
                   v.ngay_ket_thuc, v.trang_thai;
            """, nativeQuery = true)
    PhieuGiamGiaResponse getOneVoucher(@Param("id") Integer id);

    @Query(value = """
            SELECT v.id AS id,
                   ROW_NUMBER() OVER(ORDER BY v.ngay_tao DESC ) AS indexs,
                   v.ma AS ma, 
                   v.ten AS ten,
                   v.loai AS loai,
                   v.so_luong AS soLuong,
                   v.gia_tri_hoa_don_duoc_giam AS giaTriHoaDonDuocGiam,
                   v.gia_tri_hoa_don_duoc_ap_dung AS giaTriHoaDonDuocApDung,
                   v.ngay_bat_dau AS ngayBatDau,
                   v.hinh_thuc_giam AS hinhThucGiam,
                   v.ngay_ket_thuc AS ngayKetThuc,
                   v.trang_thai AS trangThai
            FROM phieu_giam_gia v
            WHERE (:#{#req.ten} IS NULL OR v.ten LIKE CONCAT(%:#{#req.ten}%) 
            OR v.ma LIKE CONCAT(%:#{#req.ten}%))
              AND (:#{#req.trangThai} IS NULL OR v.trang_thai = :#{#req.trangThai})
              AND (:#{#req.loai} IS NULL OR v.loai = :#{#req.loai})
              AND (:#{#req.hinhThucGiam} IS NULL OR v.hinh_thuc_giam = :#{#req.hinhThucGiam})
              AND (:#{#req.nguoiSua} IS NULL OR v.ngay_bat_dau >= :#{#req.nguoiSua})
               AND (:#{#req.nguoiTao} IS NULL OR v.ngay_ket_thuc <= :#{#req.nguoiTao})
             AND (:#{#req.giaTriHoaDonDuocApDung} IS NULL OR
             (v.gia_tri_hoa_don_duoc_ap_dung BETWEEN 0 AND :#{#req.giaTriHoaDonDuocGiam}))
             
            """, nativeQuery = true)
    Page<PhieuGiamGiaResponse> getAllVoucher(@Param("req") PhieuGiamGiaRequest request, Pageable pageable);

    Boolean existsByMa(String ma);
}
