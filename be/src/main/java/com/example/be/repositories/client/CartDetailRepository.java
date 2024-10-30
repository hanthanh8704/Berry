package com.example.be.repositories.client;

import com.example.be.entities.CartDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface CartDetailRepository extends JpaRepository<CartDetail, Integer> {

    @Query("select ghct from CartDetail  ghct join ghct.cart gh where gh.customer.id =:idKH ")
    List<CartDetail> findAllByIdKh(@Param("idKH") Integer idKH);

    @Query("select gh from CartDetail gh  where gh.productDetail.id =:idSPCT and gh.cart.id =:idGH ")
    CartDetail findBySpctId(@Param("idSPCT") Integer idSPCT , @Param("idGH") Integer idGH );
    @Query("select gh from CartDetail gh where gh.productDetail.id = :idSPCT and gh.cart.customer.id = :idKH")
    CartDetail findByIdSPCT(@Param("idSPCT") Integer idSPCT ,@Param("idKH") Integer idKH);
    @Query("select gh from CartDetail gh where gh.cart.id = :idCart ")
    List<CartDetail> findByIdCart(@Param("idCart") Integer idCart );
    List<CartDetail> findAllByCreatedAtBefore(LocalDateTime dateTime);
}
