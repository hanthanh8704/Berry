package com.example.connectdb.repositories;

import com.example.connectdb.dto.request.label.ThuongHieuRequest;

import com.example.connectdb.dto.response.ThuongHieuResponse;
import com.example.connectdb.entity.TayAo;
import com.example.connectdb.entity.ThuongHieu;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ThuongHieuRepository extends JpaRepository<ThuongHieu, Integer> {
    @Query(value = """
       SELECT
            c.id AS id,
            c.ten AS ten,
            c.ngay_tao AS ngayTao,
            c.trang_thai AS trangThai,
            ROW_NUMBER() OVER(ORDER BY c.ngay_tao DESC) AS indexs
            FROM thuong_hieu c
            WHERE (:#{#req.ten} IS NULL OR c.ten LIKE %:#{#req.ten}%)
            AND (:#{#req.trangThai} IS NULL OR c.trang_thai = :#{#req.trangThai})
            """, nativeQuery = true)
    Page<ThuongHieuResponse> findAllByCriteria(@Param("req") ThuongHieuRequest request, Pageable pageable);

    ThuongHieu findByTen(String ten);

    boolean existsByTenIgnoreCase(String ten);
}
