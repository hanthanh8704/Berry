package com.example.be.repositories.admin;

import com.example.be.dto.admin.request.brand.BrandRequest;
import com.example.be.dto.admin.response.BrandResponse;
import com.example.be.entities.Brand;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BrandRepository extends JpaRepository<Brand, Integer> {
    @Query(value = """
            SELECT
                 b.id AS id,
                 b.name AS name,
                 b.created_at AS createdAt,
                 b.status AS status,
                 ROW_NUMBER() OVER(ORDER BY b.created_at DESC) AS indexs
                 FROM brand b
                 WHERE (:#{#req.name} IS NULL OR b.name LIKE %:#{#req.name}%)
                 AND (:#{#req.status} IS NULL OR b.status = :#{#req.status})
                 """, nativeQuery = true)
    Page<BrandResponse> findAllByCriteria(@Param("req") BrandRequest request, Pageable pageable);

    Brand findByName(String name); // Changed from 'findByTen' to 'findByName'

    boolean existsByNameIgnoreCase(String name); // Changed from 'existsByTenIgnoreCase' to 'existsByNameIgnoreCase'
}
