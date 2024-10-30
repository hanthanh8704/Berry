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



    @Query(value = """
            SELECT 
            COALESCE(SUM(total_money), 0)
             FROM payment
             WHERE id_bill = :idBill
            """, nativeQuery = true)
    BigDecimal sumTotalMoneyByIdBill(Integer idBill);

    @Modifying
    @Query(value = """
             DELETE FROM  payment
             WHERE id_bill = :id AND method NOT IN ('Chuyển khoản')
            """, nativeQuery = true)
    int deleteAllByIdBill(@Param("id") Integer idBill);


    @Query(value = """
             SELECT COUNT(id) FROM payment
             WHERE id_bill = :idBill
             AND status = 'TRA_SAU'
            """, nativeQuery = true)
    int countPayMentPostpaidByIdBill(@Param("idBill") Integer idBill);

    @Modifying
    @Query(value = """
                    UPDATE payment pa
                    SET pa.status = 'THANH_TOAN'
                    WHERE pa.id_bill = :idBill
                    """, nativeQuery = true)
    void updateAllByIdBill(@Param("idBill") Integer idBill);

    @Query(value = """
                    SELECT id FROM payment
                    WHERE transaction_no = :code
                    """, nativeQuery = true)
    List<String> findAllByVnpTransactionNo(@Param("code") String code);

    @Query(value = """
                    SELECT id  FROM payment
                    WHERE id_bill = :idBill
                    AND method = 'TIEN_MAT' 
                    AND status = 'TRA_SAU' 
                    """, nativeQuery = true)
    List<Integer> findAllPayMentByIdBillAndMethod(@Param("idBill") Integer idBill);

    @Query(value = """
                    SELECT sum(total_money)  FROM payment
                    WHERE `bill_id` = :idBill
                    """, nativeQuery = true)
    BigDecimal findTotalPayMnetByIdBill(@Param("idBill") Integer idBill);

    @Query(value = """
                    SELECT * FROM payment
                    WHERE bill_id = :idBill and status = 'THANH_TOAN'
                    """, nativeQuery = true)
    PaymentResponse findByBill(@Param("idBill") Integer idBill);

}
