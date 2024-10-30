package com.example.be.dto.admin.request.address;


import com.example.be.utils.common.PageableRequest;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


/**
 * @author hanthanh
 */
@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AddressRequest extends PageableRequest {
    private Integer idKhachHang;
    private String fullName;
    @Pattern(regexp = "^0[0-10]{10}$", message = "Số điện thoại không hợp lệ")
    private String phoneNumber;
    private String city;
    private String district;
    private String ward;
    private Boolean defaultAddress;
    private String detailedAddress;
    private String status;
    private String createdBy;
    private String updatedBy;
    private Boolean deleted;

}
