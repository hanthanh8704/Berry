package com.example.be.repositories.admin;

import com.example.be.dto.admin.request.category.CategoryRequest;
import com.example.be.dto.admin.response.CategoryResponse;
import com.example.be.entities.Category;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface CategoryRepository extends JpaRepository<Category, Integer> {

    @Query(value = """
            SELECT
            c.id AS id,
            c.name AS name, 
            c.created_at AS createdAt,
            c.status AS status, 
            ROW_NUMBER() OVER(ORDER BY c.created_at DESC) AS indexs
            FROM category c
            WHERE (:#{#req.name} IS NULL OR c.name LIKE %:#{#req.name}%)
            AND (:#{#req.status} IS NULL OR c.status = :#{#req.status})
            """, nativeQuery = true)
    Page<CategoryResponse> findAllByCriteria(@Param("req") CategoryRequest request, Pageable pageable);

    Category findByName(String name); // Đổi tên phương thức từ 'findByTen' thành 'findByName'

    boolean existsByNameIgnoreCase(String name); // Đổi tên phương thức từ 'existsByTenIgnoreCase' thành 'existsByNameIgnoreCase'
}
