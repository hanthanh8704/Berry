package com.example.be.repositories.admin;

import com.example.be.dto.admin.request.voucher.VoucherRequest;
import com.example.be.dto.admin.response.voucher.VoucherResponse;
import com.example.be.entities.Voucher;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
/**
 * @author ninhncph40535
 *
 */
@Repository
public interface VoucherRepository extends JpaRepository<Voucher,Integer> {
    @Query(value = """
             SELECT v.id AS id,
                   ROW_NUMBER() OVER(ORDER BY v.created_at DESC) AS indexs,
                   v.code AS code, v.name AS name,
                   v.quantity AS quantity,
                   v.type AS type,
                   v.discount_value AS discountValue,
                   v.minimum_order_value AS minOrderValue,
                   v.maximum_discount_value AS maxDiscountValue,
                   v.start_date AS startDate,
                   v.discount_method AS discountMethod,
                   v.end_date AS endDate,
                   v.status AS status
            FROM voucher v JOIN voucher_customer av ON v.id = av.voucher_id
            WHERE av.customer_id = :idAccount
            And (:#{#req.name} IS NULL OR v.name LIKE CONCAT(%:#{#req.name}%) 
            OR v.code LIKE CONCAT(%:#{#req.code}%))
            AND (:#{#req.status} IS NULL OR v.status LIKE CONCAT(%:#{#req.status}%))
            AND av.status ='CHUA_SU_DUNG'
            """, nativeQuery = true)
    List<VoucherResponse> getAccountVoucher(@Param("idAccount") Integer idAccount, @Param("req") VoucherRequest request);

    @Query(value = """
            SELECT v.id AS id,
                   ROW_NUMBER() OVER(ORDER BY v.created_at DESC) AS indexs,
                   v.code AS code, v.name AS name,
                   v.quantity AS quantity,
                   v.type AS type,
                   v.discount_value AS discountValue,
                   v.minimum_order_value AS minOrderValue,
                   v.maximum_discount_value AS maxDiscountValue,
                   v.start_date AS startDate,
                   v.discount_method AS discountMethod,
                   v.end_date AS endDate,
                   v.status AS status
            FROM voucher v 
            WHERE  (:#{#req.name} IS NULL OR v.name LIKE CONCAT( %:#{#req.name}%) 
            OR v.code LIKE CONCAT(%:#{#req.code}%))
             AND (:#{#req.status} IS NULL OR v.status LIKE CONCAT(%:#{#req.status}%))
             AND  v.type ='CONG_KHAI'
             
            """, nativeQuery = true)
    List<VoucherResponse> getPublicVoucher(@Param("req") VoucherRequest request);

    @Query(value = """
               SELECT
                   v.id AS id,
                    ROW_NUMBER() OVER(ORDER BY v.created_at DESC) AS indexs,
                   v.code AS code, v.name AS name,
                   v.quantity AS quantity,
                   v.type AS type,
                   v.discount_value AS discountValue,
                   v.minimum_order_value AS minOrderValue,
                   v.maximum_discount_value AS maxDiscountValue,
                   v.start_date AS startDate,
                   v.discount_method AS discountMethod,
                   v.end_date AS endDate,
                   v.status AS status,
                   GROUP_CONCAT(pggkh.customer_id) AS customers
               FROM voucher v LEFT JOIN voucher_customer pggkh ON pggkh.voucher_id = v.id
               WHERE v.id =:id 
               GROUP BY v.id, v.code, v.name, v.quantity, v.type, v.discount_value,
                   v.minimum_order_value, v.start_date, v.discount_value,
                   v.end_date, v.status;
            """, nativeQuery = true)
    VoucherResponse getOneVoucher(@Param("id") Integer id);

    @Query(value = """
            SELECT v.id AS id,
                    ROW_NUMBER() OVER(ORDER BY v.created_at DESC) AS indexs,
                   v.code AS code, v.name AS name,
                   v.quantity AS quantity,
                   v.type AS type,
                   v.discount_value AS discountValue,
                   v.minimum_order_value AS minOrderValue,
                   v.maximum_discount_value AS maxDiscountValue,
                   v.start_date AS startDate,
                   v.discount_method AS discountMethod,
                   v.end_date AS endDate,
                   v.status AS status
            FROM voucher v 
            WHERE (:#{#req.name} IS NULL OR v.name LIKE CONCAT(%:#{#req.name}%) 
            OR v.code LIKE CONCAT(%:#{#req.code}%))
              AND (:#{#req.status} IS NULL OR v.status = :#{#req.status})
              AND (:#{#req.findType} IS NULL OR v.type = :#{#req.findType})
              AND (:#{#req.discountMethod} IS NULL OR v.discount_method = :#{#req.discountMethod})
              AND (:#{#req.updatedBy} IS NULL OR v.start_date >= :#{#req.updatedBy})
               AND (:#{#req.createdBy} IS NULL OR v.end_date <= :#{#req.createdBy})
             AND (:#{#req.minOrderValue} IS NULL OR
             (v.minimum_order_value BETWEEN :#{#req.minOrderValue} AND :#{#req.discountValue}))
             
            """, nativeQuery = true)
    Page<VoucherResponse> getAllVoucher(@Param("req") VoucherRequest request, Pageable pageable);

    Boolean existsByCode(String ma);
}