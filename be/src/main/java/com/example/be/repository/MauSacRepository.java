package com.example.be.repository;

import com.example.be.dto.request.color.MauSacRequest;
import com.example.be.dto.response.MauSacResponse;
import com.example.be.entity.MauSac;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MauSacRepository extends JpaRepository<MauSac,Integer> {
    @Query(value = """
            SELECT
            c.id AS id,
            c.code_hex AS code,
            c.ten AS ten,
            c.ngay_tao AS ngayTao,
            c.trang_thai AS trangThai,
            ROW_NUMBER() OVER(ORDER BY c.ngay_tao DESC) AS indexs
            FROM mau_sac c
            WHERE (:#{#req.ten} IS NULL OR c.ten LIKE %:#{#req.ten}%)
            AND (:#{#req.trangThai} IS NULL OR c.trang_thai = :#{#req.trangThai})
            """, nativeQuery = true)
    Page<MauSacResponse> findAllByCriteria(@Param("req") MauSacRequest request, Pageable pageable);

    MauSac findByTen(String ten);

    MauSac findByCode(String code);
    boolean existsByTenIgnoreCase(String ten);

    boolean existsByCodeIgnoreCase(String code);
}
