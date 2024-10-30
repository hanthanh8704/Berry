package com.example.be.utils.security.auth;

import jakarta.validation.constraints.*;
import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class AuthRequest {

    private Integer id;

    private String email;

    private String username;




    private String password;

    private Integer employeeId;

    private String name;

    private String employeeName;
}
