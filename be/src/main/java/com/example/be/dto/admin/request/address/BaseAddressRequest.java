package com.example.be.dto.admin.request.address;

import com.example.be.utils.constant.StatusAddress;
import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

/**
 * @author hanthanh
 */

@Getter
@Setter
public abstract class BaseAddressRequest {

    private String id;

    @NotBlank(message = "Vui lòng không để trống tên đường")
    private String line;

    @NotBlank(message = "Vui lòng không để trống tên quận, huyện")
    private String district;

    @NotBlank(message = "Vui lòng không để trống tên tỉnh, thành phố")
    private String province;

    @NotBlank(message = "Vui lòng không để trống tên xã")
    private String ward;

    private Integer provinceId;

    private Integer toDistrictId;

    private String wardCode;

    private StatusAddress status;

    private String customerId;

    @NotBlank(message = "Vui lòng không để trống tên")
    private String fullName;

    @NotBlank(message = "Vui lòng không để trống số điện thoại")
    private String phoneNumber;
}
