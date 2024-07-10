package com.example.be.util.converter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import com.example.be.repository.AccountRepository;
@Component
public class AccountConvert {
    @Autowired
    private AccountRepository accountRepository;

}
