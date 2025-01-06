package com.example.be.dto.admin.response.bill;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

/**
 * @author hanthanh
 */
@Getter
@Setter
@Builder
public class RollBackBillResponse {

    private String code;

    private String fullName;

    private String note;

    private String url;

}
