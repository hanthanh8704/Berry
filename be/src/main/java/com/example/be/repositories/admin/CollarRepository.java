package com.example.be.repositories.admin;

import com.example.be.dto.admin.request.collar.CollarRequest;
import com.example.be.dto.admin.response.CollarResponse;
import com.example.be.entities.Collar;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CollarRepository extends JpaRepository<Collar, Integer> {
    @Query(value = """
            SELECT
            c.id AS id,
            c.name AS name, 
            c.created_at AS createdAt,
            c.status AS status,
            ROW_NUMBER() OVER(ORDER BY c.created_at DESC) AS indexs
            FROM collar c 
            WHERE (:#{#req.name} IS NULL OR c.name LIKE %:#{#req.name}%)
            AND (:#{#req.status} IS NULL OR c.status = :#{#req.status}) 
            """, nativeQuery = true)
    Page<CollarResponse> findAllByCriteria(@Param("req") CollarRequest request, Pageable pageable);

    Collar findByName(String name); // Changed from 'findByTen' to 'findByName'

    boolean existsByNameIgnoreCase(String name); // Changed from 'existsByTenIgnoreCase' to 'existsByNameIgnoreCase'


}
