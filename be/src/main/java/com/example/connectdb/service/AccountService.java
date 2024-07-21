package com.example.connectdb.service;

import com.example.connectdb.entity.Account;
import com.example.connectdb.repositories.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AccountService {

    @Autowired
    private AccountRepository accountRepository;

    public Optional<Account> findByEmail(String email) {
        return accountRepository.findByEmail(email);
    }

    public Account save(Account account) {
        return accountRepository.save(account);
    }
}
