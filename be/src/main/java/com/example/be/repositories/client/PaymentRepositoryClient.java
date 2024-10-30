package com.example.be.repositories.client;

import com.example.be.entities.Payment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PaymentRepositoryClient extends JpaRepository<Payment, Integer> {

}
