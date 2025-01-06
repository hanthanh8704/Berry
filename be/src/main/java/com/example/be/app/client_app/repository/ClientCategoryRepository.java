package com.example.be.app.client_app.repository;


import com.example.be.entities.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ClientCategoryRepository extends JpaRepository<Category,Integer> {
}
