package com.poly.backend.repository;

import com.poly.backend.entity.English.ProductDetailPromotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DotGiamGiaDetailRepository extends JpaRepository<ProductDetailPromotion, Integer> {
    @Query(value = """
        SELECT GROUP_CONCAT(DISTINCT s.id) 
        FROM product_detail_promotion pmd
        JOIN product_detail sd ON sd.id = pmd.idSPCT
        JOIN product s ON s.id = sd.product_id
        JOIN promotion pm ON pm.id = pmd.promotion_id
        WHERE (:idDGG IS NULL OR pm.id = :idDGG)
        """, nativeQuery = true)
    List<Integer> getListIdSanPhamDotGiamGia(@Param("idDGG") Integer idDGG);

    @Query(value = """
            SELECT pmd.productDetail FROM ProductDetailPromotion pmd
            WHERE :idDGG IS NULL OR pmd.promotion = :idDGG
            """)
    List<Integer> getListIdSanPhamDetailInDotGiamGia(@Param("idDGG") Integer idDGG);

    @Query("SELECT pd.id FROM ProductDetailPromotion pd WHERE pd.promotion.id = :idDGG")
    List<Integer> findIdsByDotGiamGiaId(@Param("idDGG") Integer idDGG);

    @Query("SELECT pd FROM ProductDetailPromotion pd join pd.promotion d WHERE d.id = :idDGG")
    List<ProductDetailPromotion> getDGGDetailByidDotGG(@Param("idDGG") Integer idDGG);

    @Query("SELECT dt FROM ProductDetailPromotion dt JOIN dt.productDetail spct WHERE spct.id = :idSPCT and dt.status = 'Đang diễn ra'")
    Optional<ProductDetailPromotion> getFirstDGGDetailByIdSPCT(@Param("idSPCT") Integer idSPCT);
    @Query("SELECT pd FROM ProductDetailPromotion pd WHERE pd.productDetail.id = :idSPCT")
    List<ProductDetailPromotion> findByIdSPCT(@Param("idSPCT") Integer idSPCT);

}
