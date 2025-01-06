package com.example.be.repositories.admin;


import com.example.be.dto.admin.response.payment.PaymentResponse;
import com.example.be.entities.Bill;
import com.example.be.entities.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * @author hanthanh
 */
@Repository
public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    List<Payment> findAllByBill(Bill bill);

    @Query(value = "SELECT p FROM Payment p WHERE  p.bill.id = :idBill")
    Payment findByIdBill(@Param("idBill") Integer idBill);

    @Query(value = """
            SELECT
              ROW_NUMBER() OVER(ORDER BY tt.created_at ASC) AS indexs,
              hd.id AS idBill,
              tt.id AS id,
              tt.transaction_no AS tranSactionNo,
              tt.transaction_date AS tranSactionDate,
              tt.created_at,
              tt.method AS method,
              tt.total_money AS totalMoney,
              tt.status AS status ,
              e.name AS nameEmployee
             FROM payment tt
             LEFT JOIN bill hd ON hd.id = tt.bill_id
             LEFT JOIN
                 employee e ON e.id = tt.employee_id
             WHERE hd.id = :idHoaDon
                        """, nativeQuery = true)
    List<PaymentResponse> getThanhToanByIdHoaDon(@Param("idHoaDon") Integer idHoaDon);

    @Query(value = """
            SELECT 
            COALESCE(SUM(total_money), 0)
             FROM payments_method
             WHERE bill_id = :idBill
            """, nativeQuery = true)
    BigDecimal sumTotalMoneyByIdBill(Integer idBill);

    @Query(value = """
             SELECT COUNT(id) FROM payment
             WHERE bill_id = :idBill
             AND status = 'TRA_SAU'
            """, nativeQuery = true)
    int countPayMentPostpaidByIdBill(@Param("idBill") Integer idBill);

    @Modifying
    @Query(value = """
                    UPDATE payment pa
                    SET pa.status = 'THANH_TOAN'
                    WHERE pa.bill_id = :idBill
                    """, nativeQuery = true)
    void updateAllByIdBill(@Param("idBill") Integer idBill);

    @Query(value = """
                    SELECT id FROM payment
                    WHERE transaction_no = :code
                    """, nativeQuery = true)
    List<String> findAllByVnpTransactionNo(@Param("code") String code);

    @Query(value = """
                    SELECT id  FROM payment
                    WHERE bill_id = :idBill
                    AND method = 'TIEN_MAT' 
                    AND status = 'TRA_SAU' 
                    """, nativeQuery = true)
    List<Integer> findAllPayMentByIdBillAndMethod(@Param("idBill") Integer idBill);

    @Query(value = """
                    SELECT sum(total_money)  FROM paymentx``
                    WHERE bill_id = :idBill
                    """, nativeQuery = true)
    BigDecimal findTotalPayMnetByIdBill(@Param("idBill") Integer idBill);

    @Query(value = """
                    SELECT
                        ROW_NUMBER() OVER(ORDER BY p.created_at DESC) AS indexs,
                        p.*
                    FROM payment p
                    WHERE p.bill_id = :idBill AND p.status = 'THANH_TOAN'
                    """, nativeQuery = true)
    List<PaymentResponse> findByBill(@Param("idBill") Integer idBill);

    @Modifying
    @Query(value = """
             DELETE FROM  payment
             WHERE bill_id = :id
            """, nativeQuery = true)
    int deleteAllByIdBill(@Param("id") Integer idBill);

}
