package com.example.be.app.client_app.repository;

import com.example.be.entities.Brand;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientBrandRepository extends JpaRepository<Brand,Integer> {
}
