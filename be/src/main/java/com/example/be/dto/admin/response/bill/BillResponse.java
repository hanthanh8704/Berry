package com.example.be.dto.admin.response.bill;

import com.example.be.entities.Bill;
import com.example.be.entities.Employee;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.math.BigDecimal;
import java.sql.Timestamp;

@Projection(types = {Bill.class, Employee.class})
public interface BillResponse {
    @Value("#{target.indexs}")
    Integer getInteger();
    String getId();

    String getCode();

    String getEmployee();

    String getVoucher();

    String getNameCustomer();

    String getRecipientName();

    String getRecipientEmail();

    String getRecipientPhone();

    String getAddress();

    String getPaymentMethod();

    String getDeliveryStatus();

    Timestamp getConfirmationDate();

    Timestamp getDeliveryDate();

    Timestamp getShippingTime();

    Timestamp getReceivedDate();

    String getInvoiceType();

    BigDecimal getShippingFee();

    Integer getInvoiceStatus();

    BigDecimal getTotalMoney();

    Timestamp getCreatedAt();

    BigDecimal getDiscountAmount();

    String getNote();
}