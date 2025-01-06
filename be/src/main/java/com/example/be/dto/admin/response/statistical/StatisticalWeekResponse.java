package com.example.be.dto.admin.response.statistical;

import org.springframework.beans.factory.annotation.Value;

public interface StatisticalWeekResponse {
    @Value("#{target.totalBillWeek}")
    Integer getTotalBillWeek();
    @Value("#{target.totalBillAmountWeek}")
    Integer getTotalBillAmountWeek();
    @Value("#{target.totalProductWeek}")
    Integer getTotalProductWeek();
}
