package com.example.be.repository;

import com.example.be.dto.request.material.ChatLieuRequest;
import com.example.be.dto.request.productDetail.FindShirtDetailRequest;
import com.example.be.dto.response.ChatLieuResponse;
import com.example.be.dto.response.ShirtDetailResponse;
import com.example.be.entity.ChatLieu;
import com.example.be.entity.ChiTietSanPham;
import com.example.be.entity.SanPham;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@Repository
public interface ChatLieuRepository extends JpaRepository<ChatLieu,Integer> {
    @Query(value = """
            SELECT
                c.id AS id,
                c.ten AS ten,
                c.ngay_tao AS ngayTao,
                c.ngay_sua AS ngaySua,
                c.trang_thai AS trangThai,
                ROW_NUMBER() OVER(ORDER BY c.ngay_tao DESC) AS indexs
            FROM chat_lieu c
            WHERE (:#{#req.ten} IS NULL OR c.ten LIKE %:#{#req.ten}%)
            AND (:#{#req.trangThai} IS NULL OR c.trang_thai = :#{#req.trangThai})
            """, nativeQuery = true)
    Page<ChatLieuResponse> findAllByCriteria(@Param("req") ChatLieuRequest request, Pageable pageable);


    ChatLieu findByTen(String ten);
    boolean existsByTenIgnoreCase(String ten);
}
