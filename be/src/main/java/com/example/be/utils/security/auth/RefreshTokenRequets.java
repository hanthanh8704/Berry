package com.example.be.utils.security.auth;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class RefreshTokenRequets {
    private String token;
}
