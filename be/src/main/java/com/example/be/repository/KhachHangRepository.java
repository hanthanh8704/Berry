package com.example.be.repository;

import com.example.be.dto.request.customer.KhachHangRequest;
import com.example.be.dto.response.KhachHangResponse;
import com.example.be.entity.KhachHang;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface KhachHangRepository extends JpaRepository<KhachHang, Integer> {
    @Query(value = """
            select 
            a.id as id,
            a.ma as ma,
            a.ho_ten as hoTen,
            a.email as email,
            a.gioi_tinh as gioiTinh,
            a.so_dien_thoai as soDienThoai,
            a.trang_thai as trangThai,
            a.tai_khoan as taiKhoan,
            a.mat_khau as matKhau,
            a.ngay_tao as ngayTao,
            a.ngay_sua as ngaySua,
            ROW_NUMBER() OVER(ORDER BY a.ngay_tao DESC) AS indexs
            from khach_hang a
            where (:#{#req.hoTen} is null
            or a.ho_ten like %:#{#req.hoTen}% 
            or a.email like %:#{#req.hoTen}%
            or a.so_dien_thoai like %:#{#req.hoTen}%)
            """, nativeQuery = true)
    Page<KhachHangResponse> getAll(@Param("req") KhachHangRequest req, Pageable pageable);
}
