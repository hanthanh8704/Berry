package com.example.be.repositories.client;

import com.example.be.entities.Address;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AddressRepositoryClient extends JpaRepository<Address, Integer> {
    @Query("select dc from Address dc join dc.customer kh  where kh.id = :idKH ")
    List<Address> findAllByIdKhachHang(@Param("idKH") Integer idKH);
}
