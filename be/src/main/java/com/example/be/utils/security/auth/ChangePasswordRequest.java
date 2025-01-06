package com.example.be.utils.security.auth;

import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class ChangePasswordRequest {
    private String email;
    private String oldPassword;
    private String newPassword;
}
