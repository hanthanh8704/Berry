package com.poly.backend.repository.client;

import com.poly.backend.entity.English.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ThanhToanClientRepository extends JpaRepository<Payment, Integer> {

}
