package com.example.connectdb.controller;

import com.example.connectdb.entity.Account;
import com.example.connectdb.service.AccountService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AccountService accountService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Account loginRequest) {
        Optional<Account> accountOptional = accountService.findByEmail(loginRequest.getEmail());

        if (accountOptional.isPresent()) {
            Account account = accountOptional.get();
            if (account.getPassword().equals(loginRequest.getPassword())) { // simple password check
                return ResponseEntity.ok("Đăng nhập thành công");
            }
        }

        return ResponseEntity.status(401).body("Đăng nhập thất bại");
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Account registerRequest) {
        Optional<Account> accountOptional = accountService.findByEmail(registerRequest.getEmail());
        if (accountOptional.isPresent()) {
            return ResponseEntity.status(400).body("Email đã tồn tại");
        }

        Account savedAccount = accountService.save(registerRequest);
        return ResponseEntity.ok(savedAccount);
    }
}
