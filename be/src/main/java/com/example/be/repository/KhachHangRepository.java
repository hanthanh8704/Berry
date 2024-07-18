package com.example.be.repository;

import com.example.be.dto.request.khachHang.KhachHangRequest;
import com.example.be.dto.response.KhachHangResponse;
import com.example.be.entity.KhachHang;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface KhachHangRepository extends JpaRepository<KhachHang,Integer> {
    @Query(value = """
            SELECT v.id as id,
            ROW_NUMBER() OVER(ORDER BY v.ngay_tao DESC) AS indexs,
            v.ho_ten as hoTen,
             v.so_dien_thoai as soDienThoai,
              v.email as email,
               v.gioi_tinh as gioiTinh,
               v.trang_thai as trangThai,
               pggkh.id_khach_hang as idKhachHang
                from khach_hang v left join phieu_giam_gia_khach_hang pggkh on
            v.id = pggkh.id_khach_hang
            WHERE (:#{#req.soDienThoai} IS NULL OR v.so_dien_thoai LIKE CONCAT(%:#{#req.soDienThoai}%) 
            OR v.email LIKE CONCAT(%:#{#req.email}%) OR v.ho_ten LIKE CONCAT(%:#{#req.hoTen}%))
            GROUP BY v.id, v.ho_ten, v.so_dien_thoai, v.email, v.gioi_tinh, v.trang_thai,pggkh.id_khach_hang;
            """, nativeQuery = true)
    Page<KhachHangResponse> getAllKhachHang(@Param("req") KhachHangRequest request, Pageable pageable);
    @Query(value = """
            SELECT v.id as id,
            ROW_NUMBER() OVER(ORDER BY v.ngay_tao DESC) AS indexs,
            v.ho_ten as hoTen,
             v.so_dien_thoai as soDienThoai,
              v.email as email,
               v.gioi_tinh as gioiTinh,
               v.trang_thai as trangThai,
               pggkh.id_khach_hang as idKhachHang
                from khach_hang v left join phieu_giam_gia_khach_hang pggkh on
            v.id = pggkh.id_khach_hang
            WHERE pggkh.id_phieu_giam_gia=:id
            GROUP BY v.id, v.ho_ten, v.so_dien_thoai, v.email, v.gioi_tinh, v.trang_thai, pggkh.id_khach_hang;
            """, nativeQuery = true)
    Page<KhachHangResponse> getAllKhachHangID(@Param("id") Integer id, Pageable pageable);
    @Query("""
            SELECT a FROM KhachHang a
            WHERE a.id = :id
            """)
    KhachHang getOne(@Param("id") Integer id);

    Integer findIdKhachHangByHoTenAndSoDienThoai(String hoTen, String soDienThoai);


    @Query(value = """
        SELECT 
            kh.id AS id,
            kh.ma AS ma,
            kh.ho_ten AS hoTen,
            kh.email AS email,
            kh.gioi_tinh AS gioiTinh,
            kh.ngay_sinh AS ngaySinh,
            kh.so_dien_thoai AS soDienThoai,
            kh.trang_thai AS trangThai,
            a.id AS accountId,
            a.email AS accountEmail,
            a.password AS accountPassword
        FROM khach_hang kh
        LEFT JOIN account a ON kh.account_id = a.id
        WHERE (:#{#req.hoTen} IS NULL
            OR kh.ho_ten LIKE %:#{#req.hoTen}%
            OR kh.email LIKE %:#{#req.hoTen}%
            OR kh.so_dien_thoai LIKE %:#{#req.hoTen}%)
        ORDER BY kh.ngay_tao DESC
        """, nativeQuery = true)
    Page<KhachHangResponse> getAll(@Param("req") KhachHangRequest request, Pageable pageable);

    Boolean existsByMa(String ma);

    @Query("SELECT ac FROM KhachHang ac WHERE ac.email =:email")
    Optional<KhachHang> findByEmail(String email);

}
