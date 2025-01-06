package com.example.be.app.client_app.repository;

import com.example.be.entities.Color;
import com.example.be.entities.Size;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientSizeRepository extends JpaRepository<Size,Integer> {
}
