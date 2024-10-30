package com.example.be.dto.admin.request.address;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class UpdateAddressClientRequest {
    private String id;

    private String line;

    private String district;

    private String province;

    private String ward;

    private Integer provinceId;

    private Integer toDistrictId;

    private String wardCode;

    private String fullName;

    private String phoneNumber;
}
