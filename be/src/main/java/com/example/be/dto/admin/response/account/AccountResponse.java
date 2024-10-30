package com.example.be.dto.admin.response.account;

import com.example.be.entities.Account;
import com.example.be.entities.Role;
import org.springframework.data.rest.core.config.Projection;

@Projection(types = {Account.class})
public interface AccountResponse {
    Integer getId();
    String getEmail();
    String getPassword();
    Role getRole();

}
