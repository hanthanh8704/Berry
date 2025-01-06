package com.example.be.dto.admin.request.bill;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

/**
 * @author hanthanh
 */
@Getter
@Setter
public class CreateBillRequest {

    private String idUser;

    private String name;

    private String phoneNumber;

    private String address;

}
