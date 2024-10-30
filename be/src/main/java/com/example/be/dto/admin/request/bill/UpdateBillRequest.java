package com.example.be.dto.admin.request.bill;

import lombok.Getter;
import lombok.Setter;

/**
 * @author hanthanh
 */
@Getter
@Setter
public class UpdateBillRequest {

    private String name;

    private String phoneNumber;

    private String address;

    private String moneyShip;

    private String note;
}
