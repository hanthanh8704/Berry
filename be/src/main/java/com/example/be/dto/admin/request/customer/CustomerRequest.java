package com.example.be.dto.admin.request.customer;

import com.example.be.dto.admin.request.account.AccountRequest;
import com.example.be.dto.admin.request.address.AddressRequest;
import com.example.be.utils.common.PageableRequest;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.multipart.MultipartFile;

import java.sql.Timestamp;
import java.util.Date;

/**
 * @author hanthanh
 */
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class CustomerRequest extends PageableRequest {
    private Integer indexs;
    private Integer id;
    private String fullName;
    private String code;
    private MultipartFile image;
    private String status;
    private String gender;
    private String note;
    @DateTimeFormat(pattern = "yyyy-MM-dd") // Định dạng mong đợi
    private Date dateOfBirth;
    @Pattern(regexp = "^0[0-9]{9}$", message = "Số điện thoại không hợp lệ")
    private String phoneNumber;
    @Email(message = "Email không hợp lệ")
    private String email;
    private AddressRequest addressRepuest;
    private AccountRequest accountRequest;
    private Timestamp createdAt;
    private Timestamp updatedAt;
    private Boolean deleted;

}
