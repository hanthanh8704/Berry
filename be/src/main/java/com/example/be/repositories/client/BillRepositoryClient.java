package com.example.be.repositories.client;

import com.example.be.entities.Bill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillRepositoryClient  extends JpaRepository<Bill,Integer> {
    Boolean existsByCode(String code);

    @Query("SELECT hdc FROM Bill hdc WHERE hdc.code = :code")
    Bill findByCode(@Param("code") String code);
    @Query("SELECT hdc FROM Bill hdc WHERE hdc.code = :ma and hdc.recipientPhone  = :sdt")
    Bill findByMaAndPhone(@Param("ma") String ma, @Param("sdt") String sdt);
    @Query("SELECT hdc FROM Bill hdc " +
            "WHERE hdc.customer.id = :idKH ORDER BY hdc.createdAt DESC")
    List<Bill> getAllDonMuaByIdKH(@Param("idKH") Integer idKH);
    @Query("SELECT hdc FROM Bill hdc " +
            "WHERE hdc.customer.id = :idKH")
    List<Bill> findByCustomerId(@Param("idKH") Integer idKH);
}
