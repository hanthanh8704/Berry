package com.example.be.repositories.admin;


import com.example.be.dto.admin.response.billhistory.BillHistoryResponse;
import com.example.be.entities.Bill;
import com.example.be.entities.BillHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * @author hanthanh
 */
@Repository
public interface BillHistoryRepository extends JpaRepository<BillHistory, Integer> {
    @Query(value = """
            SELECT ROW_NUMBER() OVER(ORDER BY lshd.created_at ASC) AS indexs,
                   lshd.id AS id,
                   hd.id as idBill,
                   hd.code AS billCode,
                   nv.name AS employeeName,
                   lshd.action_description AS actionDescription,
                   lshd.status AS status,
                   lshd.created_at AS createdAt,
                   lshd.updated_at AS updatedAt
            FROM bill_history lshd
            LEFT JOIN bill hd ON lshd.bill_id = hd.id
            LEFT JOIN employee nv ON lshd.employee_id = nv.id
            WHERE lshd.bill_id = :idBill
            """, nativeQuery = true)
    List<BillHistoryResponse> getByBill(@Param("idBill") Integer idBill);

    @Query(value = """
            SELECT ROW_NUMBER() OVER( ORDER BY bihi.created_at ASC ) AS stt, bihi.id, bihi.status, bihi.created_at, bihi.action_description, em.name
                            FROM bill_history bihi
                            LEFT JOIN bill bi ON bi.id = bihi.bill_id
                            LEFT JOIN employee em On em.id = bihi.employee_id
                            WHERE bill_id = :idBill
                            ORDER BY bihi.created_at ASC
            """, nativeQuery = true)
    List<BillHistoryResponse> findAllByIdBill(Integer idBill);

    List<BillHistory> findAllByBill(Bill bill);
    @Query(value = """
            SELECT *
            FROM bill_history bh
            WHERE bill_id = :idBill
            ORDER BY bh.created_at ASC
            """, nativeQuery = true)
    List<BillHistory> getBillHistoryByIdBill(@Param("idBill") Integer idBill);

}
