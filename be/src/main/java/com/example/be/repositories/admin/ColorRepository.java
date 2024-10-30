package com.example.be.repositories.admin;

import com.example.be.dto.admin.request.color.ColorRequest;
import com.example.be.dto.admin.response.ColorResponse;
import com.example.be.entities.Color;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ColorRepository extends JpaRepository<Color, Integer> {


    @Query(value = """
            SELECT
            c.id AS id,
            c.name AS name,
            c.created_at AS createdAt,
            c.status AS status,
            ROW_NUMBER() OVER(ORDER BY c.created_at DESC) AS indexs
            FROM color c
            WHERE (:#{#req.name} IS NULL OR c.name LIKE %:#{#req.name}%)
            AND (:#{#req.status} IS NULL OR c.status = :#{#req.status})
            """, nativeQuery = true)
    Page<ColorResponse> findAllByCriteria(@Param("req") ColorRequest request, Pageable pageable);

    Color findByName(String name);
    boolean existsByNameIgnoreCase(String name);
}
