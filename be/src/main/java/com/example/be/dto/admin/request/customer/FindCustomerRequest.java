package com.example.be.dto.admin.request.customer;

import com.example.be.utils.common.PageableRequest;
import lombok.Getter;
import lombok.Setter;

/**
 * @author hanthanh
 */
@Setter
@Getter
public class FindCustomerRequest extends PageableRequest {
    private String fullName;

    private String email;

    private String phoneNumber;

    private String status;

    private Long startTime;

    private Long endTime;
}
