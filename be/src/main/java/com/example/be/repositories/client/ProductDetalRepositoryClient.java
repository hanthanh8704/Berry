package com.example.be.repositories.client;

import com.example.be.entities.Product;
import com.example.be.entities.ProductDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ProductDetalRepositoryClient extends JpaRepository<ProductDetail, Integer> {
    @Query("select pc from  ProductDetail pc  where pc.createdAt >= :oneWeekAgo and pc.product.id =:id ORDER BY pc.createdAt DESC")
    List<ProductDetail> findAllByNewProductDetail(@Param("oneWeekAgo") LocalDateTime oneWeekAgo, @Param("id") Integer idSP);




    //Hien thị san pham chi tiet theo id san pham
    @Query("SELECT spct FROM ProductDetail spct " +
            "LEFT JOIN spct.product d " +
            "WHERE d.id = :idSP")
    List<ProductDetail> getAllByIdSP(@Param("idSP") Integer idSP);
    //Hiên thị sản phâpmr chi tiết liên quan

    @Query("SELECT spct FROM ProductDetail spct WHERE spct.product.id = :idSP AND spct.material.id = :idCL AND spct.brand.id = :idTH AND spct.collar.id = :iCA AND spct.sleeve.id = :idTA")
    List<ProductDetail> findByIdSPAndAttributes(
            @Param("idSP") Integer idSP,
            @Param("idCL") Integer idCL,
            @Param("idTH") Integer idTH,
            @Param("iCA") Integer iCA,
            @Param("idTA") Integer idTA
    );

    @Query("SELECT spct FROM ProductDetail spct WHERE spct.product.id = :idSP ORDER BY spct.createdAt DESC ")
    List<ProductDetail> findByIdSP(@Param("idSP") Integer idSP);

    //Tim theo idMauSac va idKichCo
    @Query("select sp from ProductDetail sp where sp.color.id = :idMau and sp.size.id = :idSize and sp.product.id = :idSP")
    ProductDetail findByIdMauSacAndIdKichCo(@Param("idMau") Integer idMau, @Param("idSize") Integer idSize, @Param("idSP") Integer idSP);

    @Query("SELECT DISTINCT spct FROM ProductDetail spct " +
            "JOIN ProductDetailPromotion pd ON spct.id = pd.productDetail.id " +
            "JOIN Promotion pr ON pr.id = pd.promotion.id " +
            "WHERE spct.discountPercentage = :discount")
    List<ProductDetail> findProductDetailsWithDiscount(@Param("discount") Integer discount);

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

    @Query("SELECT spct FROM ProductDetail spct JOIN Product sp ON sp.id = spct.product.id " +
            "WHERE (:idMS IS NULL OR spct.color.id = :idMS) AND " +
            "(:idSP IS NULL OR sp.id = :idSP) AND " +
            "(:idTH IS NULL OR spct.brand.id = :idTH) AND " +
            "(:idKC IS NULL OR spct.size.id = :idKC) AND " +
            "(:priceRange IS NULL OR " +
            "(:priceRange = 'under300' AND COALESCE(spct.discountPrice, spct.price) < 300000) OR " +
            "(:priceRange = '300to700' AND COALESCE(spct.discountPrice, spct.price) BETWEEN 300000 AND 700000) OR " +
            "(:priceRange = 'above700' AND COALESCE(spct.discountPrice, spct.price) > 700000)) AND " +
            "(spct.discountPercentage = 50)")
    List<ProductDetail> findFilteredProductsPromotionWithDiscount(
            @Param("idMS") Integer idMS,
            @Param("idSP") Integer idSP,
            @Param("idTH") Integer idTH,
            @Param("idKC") Integer idKC,
            @Param("priceRange") String priceRange);

    @Query("SELECT spct FROM ProductDetail spct JOIN Product sp ON sp.id = spct.product.id " +
            "WHERE (:idMS IS NULL OR spct.color.id = :idMS) AND " +
            "(:idSP IS NULL OR sp.id = :idSP) AND " +
            "(:idTH IS NULL OR spct.brand.id = :idTH) AND " +
            "(:idKC IS NULL OR spct.size.id = :idKC) AND " +
            "(:priceRange IS NULL OR " +
            "(:priceRange = 'under300' AND COALESCE(spct.discountPrice, spct.price) < 300000) OR " +
            "(:priceRange = '300to700' AND COALESCE(spct.discountPrice, spct.price) BETWEEN 300000 AND 700000) OR " +
            "(:priceRange = 'above700' AND COALESCE(spct.discountPrice, spct.price) > 700000)) AND " +
            "(spct.createdAt >= :oneWeekAgo)")

    List<ProductDetail> findFilteredProductsNewWithDiscount(
            @Param("idMS") Integer idMS,
            @Param("idSP") Integer idSP,
            @Param("idTH") Integer idTH,
            @Param("idKC") Integer idKC,
            @Param("priceRange") String priceRange ,
            @Param("oneWeekAgo") LocalDateTime oneWeekAgo);

    @Query("SELECT spct FROM ProductDetail spct JOIN Product sp ON sp.id = spct.product.id " +
            "WHERE (:idMS IS NULL OR spct.color.id = :idMS) AND " +
            "(:idSP IS NULL OR sp.id = :idSP) AND " +
            "(:idTH IS NULL OR spct.brand.id = :idTH) AND " +
            "(:idKC IS NULL OR spct.size.id = :idKC) AND " +
            "(:priceRange IS NULL OR " +
            "(:priceRange = 'under300' AND COALESCE(spct.discountPrice, spct.price) < 300000) OR " +
            "(:priceRange = '300to700' AND COALESCE(spct.discountPrice, spct.price) BETWEEN 300000 AND 700000) OR " +
            "(:priceRange = 'above700' AND COALESCE(spct.discountPrice, spct.price) > 700000))")
    List<ProductDetail> findFilteredProductsSellWithDiscount(
            @Param("idMS") Integer idMS,
            @Param("idSP") Integer idSP,
            @Param("idTH") Integer idTH,
            @Param("idKC") Integer idKC,
            @Param("priceRange") String priceRange);


}
