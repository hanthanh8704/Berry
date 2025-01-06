package com.example.be.repositories.admin;

import com.example.be.entities.ReturnOrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface ReturnOrderDetailRepository extends JpaRepository<ReturnOrderDetail, Integer> {
    @Query("SELECT p FROM ReturnOrderDetail p WHERE p.productDetail.id = :idProductDetail and p.returnOrder.id = :idReturnOrder")
    ReturnOrderDetail findByProductDetailIdAndReturnOrderId(@Param("idProductDetail") Integer idProductDetail, @Param("idReturnOrder") Integer idReturnOrder);
}
