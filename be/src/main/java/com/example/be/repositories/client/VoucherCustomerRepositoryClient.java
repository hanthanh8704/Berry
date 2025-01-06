package com.example.be.repositories.client;

import com.example.be.entities.Voucher;
import com.example.be.entities.VoucherCustomer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface VoucherCustomerRepositoryClient extends JpaRepository<VoucherCustomer, Integer> {
    @Query("select sp from VoucherCustomer sp where sp.voucher.id = :idVC and sp.customer.id = :idKH")
    VoucherCustomer findByIdVoucherAndIdKH(@Param("idVC") Integer idVC, @Param("idKH") Integer idKH);

}
