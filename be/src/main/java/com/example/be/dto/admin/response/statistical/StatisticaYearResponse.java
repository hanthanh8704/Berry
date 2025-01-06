package com.example.be.dto.admin.response.statistical;

import org.springframework.beans.factory.annotation.Value;

public interface StatisticaYearResponse {
    @Value("#{target.totalBillYear}")
    Integer getTotalBillYear();

    @Value("#{target.totalBillAmountYear}")
    Double getTotalBillAmountYear();

    @Value("#{target.totalProductYear}")
    Integer getTotalProductYear();
}
