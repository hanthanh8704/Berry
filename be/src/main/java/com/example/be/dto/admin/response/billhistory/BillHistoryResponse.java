package com.example.be.dto.admin.response.billhistory;

import com.example.be.entities.BillHistory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.rest.core.config.Projection;

import java.sql.Timestamp;

@Projection(types = {BillHistory.class})
public interface BillHistoryResponse {
    @Value("#{target.indexs}")
    Integer getIndex();
    Integer getIdBill();
    String getBillCode();
    String getEmployeeName();
    Integer getId();
    String getActionDescription();
    String getStatus();
    Timestamp getCreatedAt();
    Timestamp getUpdatedAt();
}
