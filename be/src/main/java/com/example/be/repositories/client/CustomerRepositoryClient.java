package com.example.be.repositories.client;

import com.example.be.entities.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CustomerRepositoryClient extends JpaRepository<Customer,Integer> {
    @Query("SELECT c FROM Customer c WHERE LOWER(c.fullName) LIKE LOWER(CONCAT('%', :ten, '%'))")
    List<Customer> getAllByIdCTen(@Param("ten") String ten);
}
