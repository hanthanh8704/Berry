package com.example.connectdb.repositories;

import com.example.connectdb.dto.request.sleeve.TayAoRequest;
import com.example.connectdb.dto.response.TayAoReponse;
import com.example.connectdb.entity.TayAo;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface TayAoRepository extends JpaRepository<TayAo, Integer> {

    TayAo findByTen(String ten);
    @Query(value = """
            SELECT
            t.id AS id,
            t.ten AS ten,
            t.ngay_tao AS ngayTao,
            t.trang_thai AS trangThai,
            ROW_NUMBER() OVER(ORDER BY t.ngay_tao DESC) AS indexs
            FROM tay_ao t
            WHERE (:#{#req.ten} IS NULL OR t.ten LIKE %:#{#req.ten}%)
            AND (:#{#req.trangThai} IS NULL OR t.trang_thai = :#{#req.trangThai})
            """, nativeQuery = true)
    Page<TayAoReponse> findAllByCriteria(@Param("req") TayAoRequest request, Pageable pageable);



    boolean existsByTenIgnoreCase(String ten);
}
