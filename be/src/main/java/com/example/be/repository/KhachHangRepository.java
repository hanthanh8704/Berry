package com.example.be.repository;

import com.example.be.dto.request.KhachHang.KhachHangRequest;
import com.example.be.dto.request.voucher.PhieuGiamGiaRequest;
import com.example.be.dto.response.KhachHangResponse;
import com.example.be.dto.response.PhieuGiamGiaResponse;
import com.example.be.entity.KhachHang;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface KhachHangRepository extends JpaRepository<KhachHang,Integer> {
    @Query(value = """
            SELECT v.id,v.ho_ten, v.so_dien_thoai, v.email, v.gioi_tinh from khach_hang v
            WHERE (:#{#req.soDienThoai} IS NULL OR v.so_dien_thoai LIKE CONCAT(%:#{#req.soDienThoai}%) 
            OR v.email LIKE CONCAT(%:#{#req.email}%) OR v.ho_ten LIKE CONCAT(%:#{#req.hoTen}%))
            """, nativeQuery = true)
    Page<KhachHangResponse> getAllKhachHang(@Param("req") KhachHangRequest request, Pageable pageable);
}
