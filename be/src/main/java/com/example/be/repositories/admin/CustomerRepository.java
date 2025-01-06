package com.example.be.repositories.admin;


import com.example.be.dto.admin.request.customer.CustomerRequest;
import com.example.be.dto.admin.response.customer.CustomerResponse;
import com.example.be.entities.Customer;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;
@Repository
public interface CustomerRepository extends JpaRepository<Customer,Integer> {
    // Truy vấn tìm mã nhân viên lớn nhất
    Boolean existsByEmail(String email);

    // Kiểm tra số điện thoại đã tồn tại chưa
    Boolean existsByPhoneNumber(String phoneNumber);
    boolean existsByEmailAndIdNot(String email, Integer id);
    boolean existsByPhoneNumberAndIdNot(String phoneNumber, Integer id);
    @Query("SELECT c.code FROM Customer c ORDER BY c.code DESC LIMIT 1")
    String findMaxCustomerCode();
    Optional<Customer> findByFullName(String fullName); // Thêm phương thức này
    Optional<Customer> findByPhoneNumber(String phoneNumber); // Thêm phương thức này
    @Query(value = """
                SELECT kh.id as id,
                       ROW_NUMBER() OVER(ORDER BY kh.created_at DESC) AS indexs,
                       kh.code AS code,
                       kh.image AS image,
                       kh.full_name AS fullName,
                       kh.email AS email,
                       kh.gender AS gender,
                       kh.note AS note,
                       kh.date_of_birth AS dateOfBirth,
                       kh.phone_number AS phoneNumber,
                       kh.status AS status,
                       a.id AS accountId,
                       a.email AS accountEmail,
                       a.password AS accountPassword
                FROM customer kh
                LEFT JOIN account a ON kh.account_id = a.id
                WHERE kh.deleted = 0 AND (:#{#req.fullName} IS NULL
                       OR kh.full_name LIKE %:#{#req.fullName}%
                       OR kh.email LIKE %:#{#req.fullName}%
                       OR kh.phone_number LIKE %:#{#req.fullName}%)
                       AND (:#{#req.status} IS NULL OR kh.status LIKE %:#{#req.status}%)
                ORDER BY kh.created_at DESC
            """, nativeQuery = true)
    Page<CustomerResponse> getAll(@Param("req") CustomerRequest request, Pageable pageable);

    Boolean existsByCode(String code);
    @Query(value = """
            SELECT * FROM customer
            WHERE id = :id
            """, nativeQuery = true)
    Customer getOne(@Param("id") Integer id);

    @Query(value = """
        SELECT
         u.id AS id,
         u.gender AS gender,
         u.full_name AS fullName,
         u.date_of_birth AS dateOfBirth,
         u.image AS image,
         u.email AS email,
         u.phone_number AS phoneNumber,
         u.status AS status,
         u.created_at AS createdAt,
         u.updated_at AS updatedAt,
         a.password AS password,
         a.id AS account
        FROM customer u
        JOIN account a ON u.account_id = a.id
        WHERE u.phone_number = :phoneNumber
        """, nativeQuery = true)
    Optional<CustomerResponse> getOneByPhoneNumber(@Param("phoneNumber") String phoneNumber);
    @Query(value = """
            SELECT v.id as id,
            ROW_NUMBER() OVER(ORDER BY v.created_at DESC) AS indexs,
            v.full_name as fullName,
             v.phone_number as phoneNumber,
              v.email as email,
               v.gender as gender,
               v.status as status,
               pggkh.customer_id as customer
                from customer v 
                left join voucher_customer pggkh 
                on v.id = pggkh.customer_id
            WHERE pggkh.voucher=:id
            GROUP BY v.id, v.full_name, v.phone_number, v.email, v.gender, v.status, pggkh.customer;
            """, nativeQuery = true)
    Page<CustomerResponse> getAllCustomerID(@Param("id") Integer id, Pageable pageable);
    @Query(value = """
          SELECT v.id as id,
            ROW_NUMBER() OVER(ORDER BY v.created_at DESC) AS indexs,
            v.full_name as fullName,
             v.phone_number as phoneNumber,
              v.email as email,
               v.gender as gender,
               v.status as status,
               pggkh.customer_id as customer
                from customer v 
                left join voucher_customer pggkh 
                on v.id = pggkh.customer_id
            WHERE (:#{#req.phoneNumber} IS NULL OR v.phone_number LIKE CONCAT(%:#{#req.phoneNumber}%) 
            OR v.email LIKE CONCAT(%:#{#req.email}%) OR v.full_name LIKE CONCAT(%:#{#req.fullName}%))
            AND v.deleted='0'
            GROUP BY v.id, v.full_name, v.id, v.phone_number, v.email, v.gender, v.status, pggkh.customer_id;
            """, nativeQuery = true)
    Page<CustomerResponse>  getAllCustomer(@Param("req") CustomerRequest request, Pageable pageable);

    @Query(value = "SELECT * FROM customer WHERE id = :customerId", nativeQuery = true)
    Customer findByIdCustomer(@Param("customerId") Integer customerId);
}
