package com.example.be.repositories.admin;


import com.example.be.entities.ReturnOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReturnOrderRepository extends JpaRepository<ReturnOrder, Integer> {
    @Query("SELECT r from ReturnOrder r join r.bill b where b.id = :idBill")
    ReturnOrder findByIdBill(@Param("idBill") Integer idBill);
}
