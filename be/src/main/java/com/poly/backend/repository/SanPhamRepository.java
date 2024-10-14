package com.poly.backend.repository;

import com.poly.backend.entity.English.Image;
import com.poly.backend.entity.English.Product;
import com.poly.backend.entity.English.ProductDetail;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SanPhamRepository extends JpaRepository<Product, Integer> {
    @Query("SELECT spct FROM ProductDetail spct " +
            "JOIN spct.product sp " +
            "WHERE sp.id = :idSP")
    List<ProductDetail> findAllSPCTBySanPhamId(@Param("idSP") Integer idSP);

    @Query("SELECT anh FROM Image anh " +
            "JOIN FETCH anh.productDetail spct " +  // LEFT JOIN FETCH để tải dữ liệu SPCT cùng với ảnh
            "WHERE spct.id = :idSPCT")
    List<Image> findAllAnhBySanPhamCTId(@Param("idSPCT") Integer idSPCT);


    //Hien thi san pham theo idDM
    @Query("SELECT sp FROM Product sp " +
            "JOIN FETCH sp.category dm " +  // LEFT JOIN FETCH để tải dữ liệu SPCT cùng với ảnh
            "WHERE dm.id = :idDM")
    List<Product> findAllByIdDanhMuc(@Param("idDM") Integer idDM);

    //Clinet
    @Query("SELECT spct FROM ProductDetail spct JOIN Product sp ON sp.id = spct.product.id " +
            "WHERE (:idMS IS NULL OR spct.color.id = :idMS) AND " +
            "(:idSP IS NULL OR sp.id = :idSP) AND " +
            "(:idTH IS NULL OR spct.brand.id = :idTH) AND " +
            "(:idKC IS NULL OR spct.size.id = :idKC) AND " +
            "(:priceRange IS NULL OR " +
            "(:priceRange = 'under300' AND COALESCE(spct.discountPrice, spct.price) < 300000) OR " +
            "(:priceRange = '300to700' AND COALESCE(spct.discountPrice, spct.price) BETWEEN 300000 AND 700000) OR " +
            "(:priceRange = 'above700' AND COALESCE(spct.discountPrice, spct.price) > 700000))")
    List<ProductDetail> findFilteredProducts(@Param("idMS") Integer idMS,
                                             @Param("idSP") Integer idSP,
                                             @Param("idTH") Integer idTH,
                                             @Param("idKC") Integer idKC,
                                             @Param("priceRange") String priceRange);
    @Query("SELECT sp FROM Product sp " +
            "WHERE sp.id IN :idSP")
    List<Product> findByIds(@Param("idSP") List<Integer> idSP);

}
