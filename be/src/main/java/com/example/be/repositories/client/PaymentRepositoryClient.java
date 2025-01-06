package com.example.be.repositories.client;

import com.example.be.entities.Bill;
import com.example.be.entities.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PaymentRepositoryClient extends JpaRepository<Payment, Integer> {
    Payment findByBill(Bill bill);
    @Query("SELECT hdc FROM Payment hdc " +
            "WHERE hdc.bill.id = :idHD")
    List<Payment> findByIdHoaDon(@Param("idHD") Integer idHD);

}
