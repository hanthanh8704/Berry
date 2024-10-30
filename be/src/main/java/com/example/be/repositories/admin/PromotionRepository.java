package com.example.be.repositories.admin;//package com.example.be.repositories.admin;


import com.example.be.entities.ProductDetail;
import com.example.be.entities.Promotion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PromotionRepository extends JpaRepository<Promotion, Integer> {
    @Query("select de from ProductDetailPromotion de join de.promotion d where d.id = :idDGG")
    /*DotGiamGiaResponse*/ Promotion findByIdDotGiamGia (@Param("idDGG") Integer id);

    @Query("select sp from ProductDetail sp join ProductDetailPromotion de on sp.id = de.productDetail.id " +
            "join Promotion d on de.promotion.id = d.id where d.id = :idDGG")
    List<ProductDetail> findByAllSPCTByIdDotGiamGia (@Param("idDGG") Integer id);

    @Query("SELECT d FROM Promotion d  ORDER BY d.status DESC ")
    List<Promotion> findAllDotGiamGiaByNgayTaoDesc();
    @Query("SELECT d FROM Promotion d where d.code = :ma")
    Optional<Promotion> findByMa(@Param("ma") String ma);

    Boolean existsByCode(String code);




}
