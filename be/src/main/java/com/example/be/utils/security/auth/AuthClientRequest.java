package com.example.be.utils.security.auth;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class AuthClientRequest {

    private Integer id;


    private String email;


    private String username;


    private String phoneNumber;


    private String password;

    private Integer customerId;

    private String customerName;


}
