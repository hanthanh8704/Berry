package com.poly.backend.repository.client;

import com.poly.backend.entity.English.Cart_detail;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface GioHangChiTietRepository extends JpaRepository<Cart_detail, Integer> {

    @Query("select ghct from Cart_detail  ghct join ghct.cart gh where gh.customer.id =:idKH ")
    List<Cart_detail> findAllByIdKh(@Param("idKH") Integer idKH);

    @Query("select gh from Cart_detail gh  where gh.productDetail.id =:idSPCT and gh.cart.id =:idGH ")
    Cart_detail findBySpctId(@Param("idSPCT") Integer idSPCT , @Param("idGH") Integer idGH );
    @Query("select gh from Cart_detail gh where gh.productDetail.id = :idSPCT and gh.cart.customer.id = :idKH")
    Cart_detail findByIdSPCT(@Param("idSPCT") Integer idSPCT ,@Param("idKH") Integer idKH);

    List<Cart_detail> findAllByCreatedAtBefore(LocalDateTime dateTime);


}
