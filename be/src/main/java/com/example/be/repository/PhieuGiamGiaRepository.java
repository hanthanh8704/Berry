package com.example.be.repository;

import com.example.be.dto.request.voucher.PhieuGiamGiaRequest;
import com.example.be.dto.response.PhieuGiamGiaResponse;
import com.example.be.entity.PhieuGiamGia;
import org.hibernate.query.Page;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.awt.print.Pageable;
import java.util.List;

@Repository
public interface PhieuGiamGiaRepository extends JpaRepository<PhieuGiamGia,Integer> {
    @Query(value = """
            SELECT
            ROW_NUMBER() OVER(ORDER BY v.create_at DESC) AS indexs,
            v.id AS id,
            v.code AS code, v.name AS name,
            v.quantity AS quantity, v.percent_reduce AS percentReduce,
            v.min_bill_value AS minBillValue,
            v.start_date AS startDate,
            v.end_date AS endDate,
            v.status AS status
            FROM voucher v 
            JOIN account_voucher av ON v.id = av.voucher_id
            WHERE av.account_id = :idAccount
            AND (:#{#req.name} IS NULL OR :#{#req.name} = '' OR v.name LIKE %:#{#req.name}% OR v.code LIKE %:#{#req.name}%)
            AND (:#{#req.deleted} IS NULL OR v.deleted = :#{#req.deleted})
            AND (:#{#req.status} IS NULL OR v.status = :#{#req.status})
            """, nativeQuery = true)
    List<PhieuGiamGiaResponse> getAccountVoucher(@Param("idAccount") Integer idAccount, @Param("req") PhieuGiamGiaRequest request);

    @Query(value = """
            SELECT v.id AS id,
            ROW_NUMBER() OVER(ORDER BY v.create_at DESC) AS indexs,
            v.code AS code, v.name AS name,
            v.start_date AS startDate,
            v.quantity AS quantity, v.percent_reduce AS percentReduce,
            v.min_bill_value AS minBillValue,
            v.end_date AS endDate,
            v.type AS type,
            v.status AS status
            FROM voucher v
            WHERE (:#{#req.name} IS NULL OR :#{#req.name} = '' OR v.name LIKE %:#{#req.name}% OR v.code LIKE %:#{#req.name}%)
            AND (:#{#req.deleted} IS NULL OR v.deleted = :#{#req.deleted})
            AND (:#{#req.status} IS NULL OR v.status = :#{#req.status})
            AND v.type = true;
            """, nativeQuery = true)
    List<PhieuGiamGiaResponse> getPublicVoucher(@Param("req") PhieuGiamGiaRequest request);

    @Query(value = """
            SELECT v.id AS id,
            ROW_NUMBER() OVER(ORDER BY v.create_at DESC) AS indexs,
            GROUP_CONCAT(DISTINCT av.account_id) AS customer,
            v.code AS code,
            v.name AS name,
            v.quantity AS quantity, v.percent_reduce AS percentReduce,
            v.min_bill_value AS minBillValue,
            v.start_date AS startDate,
            v.end_date AS endDate,
            v.type AS type,
            v.status AS status
            FROM voucher v LEFT JOIN account_voucher av ON v.id = av.voucher_id
            WHERE v.id = :id
            """, nativeQuery = true)
    PhieuGiamGiaResponse getOneVoucher(@Param("id") Integer id);

    @Query(value = """
            SELECT v.id AS id,
            ROW_NUMBER() OVER(ORDER BY v.create_at DESC) AS indexs,
            v.code AS code, v.name AS name,
            v.quantity AS quantity, v.percent_reduce AS percentReduce,
            v.min_bill_value AS minBillValue,
            v.start_date AS startDate,
            v.type AS type,
            v.end_date AS endDate,
            v.status AS status
            FROM voucher v
            WHERE (:#{#req.ten} IS NULL OR :#{#req.name} = '' OR v.name LIKE %:#{#req.name}% OR v.code LIKE %:#{#req.name}%)
            AND (:#{#req.deleted} IS NULL OR v.deleted = :#{#req.deleted})
            AND (:#{#req.status} IS NULL OR v.status = :#{#req.status})
            """, nativeQuery = true)
    Pages<PhieuGiamGiaResponse> getAllVoucher(@Param("req") PhieuGiamGiaRequest request, Pageable pageable);

    Boolean existsByCode(String code);
}
