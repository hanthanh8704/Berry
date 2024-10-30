package com.example.be.repositories.admin;

import com.example.be.dto.admin.request.size.SizeRequest;
import com.example.be.dto.admin.response.SizeResponse;
import com.example.be.entities.Size;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SizeRepository extends JpaRepository<Size, Integer> {
    @Query(value = """
            SELECT
            k.id AS id,
            k.name AS name,
            k.created_at AS createdAt,
            k.status AS status,
            ROW_NUMBER() OVER(ORDER BY k.created_at DESC) AS indexs
            FROM size k
            WHERE (:#{#req.name} IS NULL OR k.name LIKE %:#{#req.name}%)
            AND (:#{#req.status} IS NULL OR k.status = :#{#req.status})
            """, nativeQuery = true)
    Page<SizeResponse> findAllByCriteria(@Param("req") SizeRequest request, Pageable pageable);

    Size findByName(String name);

    boolean existsByNameIgnoreCase(String name);

    // Bill
    @Query(value = """
            SELECT *
            FROM size k
            WHERE k.name = :name
            """, nativeQuery = true)
    Optional<Size> findByNameSize(String name);
}
