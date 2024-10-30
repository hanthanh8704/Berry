package com.example.be.utils.security.auth;


import jakarta.validation.constraints.NotBlank;
import lombok.*;

@Setter
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
@ToString
public class RegisterRequest {

    @NotBlank(message = "Email trống")
    private String email;

    @NotBlank(message = "Mật khẩu trống")
//    @Pattern(regexp = "^(?=.*[0-9])(.{8,})$", message = "Mật khẩu phải có ít nhất 8 ký tự và chứa ít nhất 1 số")
    private String password;

}
