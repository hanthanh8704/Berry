package com.example.be.dto.admin.response.bill;

import com.example.be.repositories.admin.BillRepository;
import org.springframework.beans.factory.annotation.Value;

import java.math.BigDecimal;
import java.sql.Timestamp;

public interface BillGiveBackInformation {
    Integer getIdBill();
    Integer getIdEmployee();
    Integer getIdCustomer();
    String getCodeBill();
    String getNameCustomer();

    String getPhoneNumber();
    Integer getStatusBill();

    String getTypeBill();

    String getAddress();

    String getNote();
    BigDecimal getMaxDiscountValue();
    BigDecimal getMinOrderValue();
    Timestamp getConfirmationDate();
    Timestamp getReceivedDate();
    Timestamp getDeliveryDate();
    BigDecimal getVoucherValue();

    BigDecimal getMoneyShip();
    BigDecimal getTotalMoney();
    BigDecimal getDiscountAmount();
    String getDiscountMethod();

}
