package com.poly.backend.repository;

import com.poly.backend.entity.English.Customer;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface KhachHangRepository extends JpaRepository<Customer,Integer> {
}
