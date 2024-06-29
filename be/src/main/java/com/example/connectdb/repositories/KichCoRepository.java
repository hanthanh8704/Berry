package com.example.connectdb.repositories;

import com.example.connectdb.dto.request.size.KichCoRequest;
import com.example.connectdb.dto.response.KichCoResponse;
import com.example.connectdb.entity.KichCo;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface KichCoRepository extends JpaRepository<KichCo, Integer> {
    @Query(value = """
            SELECT
            k.id AS id,
            k.ten AS ten,
            k.ngay_tao AS ngayTao,
            k.trang_thai AS trangThai,
            ROW_NUMBER() OVER(ORDER BY k.ngay_tao DESC) AS indexs
            FROM kich_co k
            WHERE (:#{#req.ten} IS NULL OR k.ten LIKE %:#{#req.ten}%)
            AND (:#{#req.trangThai} IS NULL OR k.trang_thai = :#{#req.trangThai})
            """, nativeQuery = true)
    Page<KichCoResponse> findAllByCriteria(@Param("req") KichCoRequest request, Pageable pageable);

    KichCo findByMa(String ma);

    boolean existsByMaIgnoreCase(String ma);
}
