package com.example.be.dto.admin.request.bill;

import com.example.be.utils.constant.StatusMethod;
import com.example.be.utils.constant.StatusPayMents;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.sql.Timestamp;

/**
 * @author thangdt
 */
@Getter
@Setter
public class CreatePaymentsMethodRequest {

    private String transactionNo;

    private BigDecimal totalMoney;

    private StatusMethod method;

    private StatusPayMents status;
    private Integer employee;
    private Integer bill;

    private Timestamp transactionDate;

}
