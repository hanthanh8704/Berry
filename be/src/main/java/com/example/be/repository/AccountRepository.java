package com.example.be.repository;

import com.example.be.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AccountRepository extends JpaRepository<Account, Integer> {
    // Tìm một Account bằng email
    @Query("SELECT ac FROM Account ac WHERE ac.email = :email")
    Account getOneByEmail(@Param("email") String email);

    // Tìm một Optional<Account> bằng email
    Optional<Account> getByEmail(String email);

    // Đặt lại mật khẩu cho Account dựa trên email và số điện thoại của User
    @Query("SELECT ac FROM Account ac WHERE ac.email = :email")
    Account resetPassword(@Param("email") String email);

    // Đăng nhập bằng email và password
    @Query("SELECT ac FROM Account ac WHERE ac.email = :email AND ac.password = :password")
    Account getOneByEmailPassword(@Param("email") String email , @Param("password") String password);

    // Lấy thông tin AccountResponse từ bảng account và user dựa trên idBill
//    @Query(value = "SELECT ac.id, us.full_name AS fullName, us.phone_number AS phoneNumber,  us.email AS email, us.points" +
//            " FROM account ac\n" +
//            "LEFT JOIN user us ON us.id = ac.id_user\n" +
//            "LEFT JOIN bill bi ON bi.id_account = ac.id\n" +
//            "WHERE bi.id  = :idBill", nativeQuery = true)
//    AccountResponse getAccountUserByIdBill(@Param("idBill") String idBill);

//    // Tìm một Optional<Account> bằng email
//    @Query("SELECT ac FROM Account ac WHERE ac.email = :email")
//    Optional<Account> findByEmail(String email);

//    // Tìm một Optional<Account> bằng role
//    @Query("SELECT a FROM Account a WHERE a.roles = :role")
//    Optional<Account> findByRole(@Param("role") String role);

//    // Tìm một Optional<Account> bằng User
//    Optional<Account> findByUser(User user);
}
