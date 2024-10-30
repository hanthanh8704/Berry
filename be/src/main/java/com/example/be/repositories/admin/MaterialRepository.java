package com.example.be.repositories.admin;

import com.example.be.dto.admin.request.material.MaterialRequest;
import com.example.be.dto.admin.response.MaterialResponse;
import com.example.be.entities.Material;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface MaterialRepository extends JpaRepository<Material, Integer> {


    @Query(value = """
            SELECT
                m.id AS id,
                m.name AS name,         
                m.created_at AS createdAt,
                m.updated_at AS updatedAt, 
                m.status AS status,    
                ROW_NUMBER() OVER(ORDER BY m.created_at DESC) AS indexs
            FROM material m
            WHERE (:#{#req.name} IS NULL OR m.name LIKE %:#{#req.name}%)  
            AND (:#{#req.status} IS NULL OR m.status = :#{#req.status})  
            """, nativeQuery = true)
    Page<MaterialResponse> findAllByCriteria(@Param("req") MaterialRequest request, Pageable pageable);

    Material findByName(String name); // Changed from 'findByTen' to 'findByName'
    boolean existsByNameIgnoreCase(String name); // Changed from 'existsByTenIgnoreCase' to 'existsByNameIgnoreCase'
}
