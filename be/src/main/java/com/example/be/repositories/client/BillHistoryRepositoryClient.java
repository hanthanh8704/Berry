package com.example.be.repositories.client;

import com.example.be.entities.BillHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BillHistoryRepositoryClient extends JpaRepository<BillHistory,Integer> {
    @Query("SELECT hdc FROM BillHistory hdc join hdc.bill b where b.id = :idHD")
    List<BillHistory> findAllByIdHD(@Param("idHD") Integer idHD);
}
