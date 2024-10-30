package com.example.be.repositories.client;

import com.example.be.entities.Cart;
import com.example.be.entities.ProductDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface CartRepository extends JpaRepository<Cart, Integer> {
    Boolean existsByCode(String ma);

    @Query("select gh from Cart gh  where gh.customer.id = :idKH")
    Cart findByKhachHangId(@Param("idKH") Integer idKH);

    @Query("SELECT spct FROM ProductDetail spct " +
            "WHERE (:key IS NULL OR spct.product.name LIKE %:key%) " +
            "OR (:key IS NULL OR spct.brand.name LIKE %:key%) " +
            "OR (:key IS NULL OR spct.color.name LIKE %:key%) " +
            "OR (:key IS NULL OR spct.size.name LIKE %:key%)")
    List<ProductDetail> searchSPKey(@Param("key") String key);
}
