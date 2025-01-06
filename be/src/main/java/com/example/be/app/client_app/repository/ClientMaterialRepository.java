package com.example.be.app.client_app.repository;


import com.example.be.entities.Material;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientMaterialRepository extends JpaRepository<Material,Integer> {

}
