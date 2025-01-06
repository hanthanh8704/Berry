package com.example.be.dto.admin.request.bill;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

/*
 *  @author diemdz
 */
@Getter
@Setter
public class CancelBillClientRequest {
    private String id;
    private String description;
    private String transactionNo;
    private BigDecimal totalMoney;
}
