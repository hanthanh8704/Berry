package com.example.connectdb.repositories;

import com.example.connectdb.entity.Account;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface AccountRepository extends JpaRepository<Account, Integer> {
    Optional<Account> findByEmail(String email);
}
