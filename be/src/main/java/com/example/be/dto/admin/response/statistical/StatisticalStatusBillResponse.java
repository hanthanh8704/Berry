package com.example.be.dto.admin.response.statistical;


import org.springframework.beans.factory.annotation.Value;

/**
 * @author hanthanh
 */
public interface StatisticalStatusBillResponse {
    @Value("#{target.statusBill}")
    String getStatusBill();
    @Value("#{target.totalStatusBill}")
    Integer getTotalStatusBill();
}
