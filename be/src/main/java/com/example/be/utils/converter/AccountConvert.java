package com.example.be.utils.converter;


import com.example.be.repositories.admin.AccountRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AccountConvert {
    @Autowired
    private AccountRepository accountRepository;

}