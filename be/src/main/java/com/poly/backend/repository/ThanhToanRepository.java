package com.poly.backend.repository;

import com.poly.backend.entity.English.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ThanhToanRepository extends JpaRepository<Payment,Integer> {
}
