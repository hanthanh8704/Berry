package com.example.be.repositories.admin;

import com.example.be.dto.admin.request.sleeve.SleeveRequest;
import com.example.be.dto.admin.response.SleeveReponse;
import com.example.be.entities.Sleeve;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface SleeveRepository extends JpaRepository<Sleeve, Integer> {
    @Query(value = """
            SELECT
                s.id AS id,
                s.name AS name,
                s.created_at AS createdAt,
                s.updated_at AS updatedAt,
                s.status AS status,
                ROW_NUMBER() OVER(ORDER BY s.created_at DESC) AS indexs
            FROM sleeve s
            WHERE (:#{#req.name} IS NULL OR s.name LIKE %:#{#req.name}%)
            AND (:#{#req.status} IS NULL OR s.status = :#{#req.status})
            """, nativeQuery = true)
    Page<SleeveReponse> findAllByCriteria(@Param("req") SleeveRequest request, Pageable pageable);

    Sleeve findByName(String name); // Đổi tên từ findByTen() thành findByName()

    boolean existsByNameIgnoreCase(String name); // Đổi tên từ existsByTenIgnoreCase() thành existsByNameIgnoreCase()
}
