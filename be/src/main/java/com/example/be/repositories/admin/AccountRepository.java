package com.example.be.repositories.admin;

import com.example.be.entities.Account;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Integer> {
    Optional<Account> findByEmail(String email);

    List<Account> findByStatus(String status);

    List<Account> findByRoleId(Integer roleId);

    List<Account> findByDeleted(Boolean deleted);

    boolean existsByEmail(String email);
}
