package com.example.be.app.repository;

import com.example.be.app.dto.response.AppResponse;
import com.example.be.entities.Bill;
import com.example.be.repositories.admin.BillRepository;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;


@Repository
public interface AppOrderBillRepository extends JpaRepository<Bill, Integer> {
    @Query(value = """
            select b.id as idBill, a.id as idStaff from bill b
            join account a on a.email = b.created_by
            left join account a2 on a2.id = b.id_customer
            where b.status = 8 and (a2.phone_number = :text or b.code = :text)
            """,nativeQuery = true)
    AppResponse findBillApp(@Param("text") String text);


}
