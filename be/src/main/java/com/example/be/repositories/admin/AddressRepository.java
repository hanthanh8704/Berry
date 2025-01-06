package com.example.be.repositories.admin;

import com.example.be.dto.admin.response.address.AddressResponse;
import com.example.be.entities.Address;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
@Repository
public interface AddressRepository extends JpaRepository<Address,Integer> {
    @Query("SELECT d from Address d WHERE d.customer.id = :idKhachHang")
    List<Address> findAllByIdCustomerAndDeletedFalse(@Param("idKhachHang") Integer idKhachHang);
    @Query("SELECT d from Address d WHERE d.customer.id = :idKhachHang AND d.defaultAddress = true")
    Address findByIdKhAndDefaultAddress(@Param("idKhachHang") Integer idKhachHang);

    @Query(value = "SELECT d.id, d.full_name, d.phone_number, d.city, d.district, d.ward, d.detailed_address, d.status " +
            "FROM address d WHERE d.customer_id = :idKhachHang", nativeQuery = true)
    List<AddressResponse> findAllByIdCustomer(@Param("idKhachHang") Integer idKhachHang);
//
//    Page<DiaChi> findByAccountIdAndDeleted(Integer id, Boolean deleted, Pageable pageable);
//
//    DiaChi findByAccountIdAndDefaultAddress(Integer id, Boolean defaultAddress);

    @Query(value = """
             SELECT
                                     a.id AS id,
                                     a.full_name AS fullName,
                                     a.district AS district,
                                     a.ward AS ward,
                                     a.city AS city,
                                     a.phone_number AS phoneNumber,
                                     a.default_address AS defaultAddress,
                                     a.detailed_address AS detailedAddress,
                                     a.status AS status,
                                     a.customer_id as customer,
                                     ROW_NUMBER() OVER(ORDER BY a.created_at DESC) AS indexs
                                     FROM address a
                         LEFT JOIN customer ac on ac.id = a.customer_id
             WHERE a.customer_id = :id  
            GROUP BY a.id,a.full_name,a.district,a.ward,a.city,a.status,a.customer_id, a.default_address,a.detailed_address,a.phone_number
             """, nativeQuery = true)
    Page<AddressResponse> getAddress(@Param("id") Integer id, Pageable pageable);
    @Query(value = "SELECT * FROM address WHERE customer_id = :idKhachHang", nativeQuery = true)
    List<Address> findByIdCustomer(@Param("idKhachHang") Integer idKhachHang);

    @Query(value = "SELECT * FROM address WHERE customer_id = :idKhachHang AND default_address = '1'", nativeQuery = true)
    Address findByIdCustomer1(@Param("idKhachHang") Integer idKhachHang);


//    DiaChi findByIdKhachHangAndDiaChiMacDinh(Integer idKhachHang, Boolean diaChiMacDinh);

}

