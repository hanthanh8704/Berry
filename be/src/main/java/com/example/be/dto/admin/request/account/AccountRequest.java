package com.example.be.dto.admin.request.account;

import com.example.be.utils.common.PageableRequest;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

/**
 * @author hanthanh
 */
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AccountRequest extends PageableRequest {

    @Email(message = "Email không hợp lệ")
    @NotBlank(message = "Vui lòng không để trống email")
    String email;
    @NotBlank(message = "Vui lòng không để trống mật khẩu")
    @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")
    String password;
    Integer role;
    Timestamp createdAt;
    Timestamp updatedAt;
}
