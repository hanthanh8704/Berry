package com.example.be.dto.admin.request.customer;

import com.example.be.utils.constant.StatusCustomer;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

/**
 * DTO for customer request.
 *
 * @author hanthanh
 */
@Getter
@Setter
public abstract class BaseCustomerRequest {

    @NotBlank(message = "Vui lòng không để trống tên")
    private String fullName;

    @NotNull(message = "Vui lòng không để trống ngày sinh")
    private Long dateOfBirth;

    @NotBlank(message = "Vui lòng không để trống số điện thoại")
    private String phoneNumber;

    @Email(message = "Email không hợp lệ")
    @NotBlank(message = "Vui lòng không để trống email")
    private String email;

    @NotNull(message = "Vui lòng không để trống giới tính")
    private String gender;

    private String image;

    private StatusCustomer status;

}
