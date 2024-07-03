package com.example.connectdb.repositories;

import com.example.connectdb.dto.request.material.ChatLieuRequest;
import com.example.connectdb.entity.ChatLieu;
import com.example.connectdb.dto.response.ChatLieuResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ChatLieuRepository extends JpaRepository<ChatLieu, Integer> {

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



    boolean existsByTenIgnoreCase(String ten);
}
