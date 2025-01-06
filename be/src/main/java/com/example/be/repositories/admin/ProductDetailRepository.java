package com.example.be.repositories.admin;//package com.example.be.repositories.admin;

import com.example.be.entities.ProductDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductDetailRepository extends JpaRepository<ProductDetail, Integer> {

    @Query("SELECT p FROM ProductDetail p where p.product.id = :id")
    List<ProductDetail> getAllIdSanPham(@Param("id") Integer id);
}
