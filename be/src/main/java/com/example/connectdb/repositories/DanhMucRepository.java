package com.example.connectdb.repositories;

import com.example.connectdb.dto.request.category.DanhMucRequest;
import com.example.connectdb.entity.DanhMuc;
import com.example.connectdb.dto.response.DanhMucResponse;
import com.example.connectdb.entity.TayAo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DanhMucRepository extends JpaRepository<DanhMuc, Integer> {

    @Query(value = """
            SELECT
            c.id AS id,
            c.ten AS ten,
            c.ngay_tao AS ngayTao,
            c.trang_thai AS trangThai,
            ROW_NUMBER() OVER(ORDER BY c.ngay_tao DESC) AS indexs
            FROM danh_muc c
            WHERE (:#{#req.ten} IS NULL OR c.ten LIKE %:#{#req.ten}%)
            AND (:#{#req.trangThai} IS NULL OR c.trang_thai = :#{#req.trangThai})
            """, nativeQuery = true)
    Page<DanhMucResponse> findAllByCriteria(@Param("req") DanhMucRequest request, Pageable pageable);

    DanhMuc findByTen(String ten);

    boolean existsByTenIgnoreCase(String ten);
}
