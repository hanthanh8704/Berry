package com.example.be.dto.admin.response.statistical;


import org.springframework.beans.factory.annotation.Value;

/**
 * @author hanthanh
 */
public interface StatisticalMonthlyResponse {
    @Value("#{target.totalBillMonth}")
    Integer getTotalBillMonth();
    @Value("#{target.totalProductMonth}")
    Integer getTotalProductMonth();
    @Value("#{target.totalBillAmountMonth}")
    Integer getTotalBillAmountMonth();
}
