package com.example.be.dto.response;

import com.example.be.entity.Account;
import com.example.be.entity.ChucVu;
import org.springframework.data.rest.core.config.Projection;

@Projection(types = {Account.class})
public interface AccountResponse {
    Integer getId();
    String getEmail();
    String getPassword();
    ChucVu getChucVu();
}
