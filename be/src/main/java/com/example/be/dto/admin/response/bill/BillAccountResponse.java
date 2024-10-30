package com.example.be.dto.admin.response.bill;
/*
 *  @author diemdz
 */

import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;

public interface BillAccountResponse {

    @Value("#{target.id}")
    String getId();

    @Value("#{target.totalMoney}")
    BigDecimal getTotalMoney();

    @Value("#{target.statusBill}")
    String getStatusBill();
    @Value("#{target.billDetail}")
     String getBillDetail();

}
