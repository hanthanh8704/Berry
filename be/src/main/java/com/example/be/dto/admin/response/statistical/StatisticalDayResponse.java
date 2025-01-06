package com.example.be.dto.admin.response.statistical;

import org.springframework.beans.factory.annotation.Value;

/**
 * @author hanthanh
 */
public interface StatisticalDayResponse {
    @Value("#{target.totalBillToday}")
    Integer getTotalBillToday();
    @Value("#{target.totalProductDay}")
    Integer getTotalProductDay();
    @Value("#{target.totalBillAmountToday}")
    Integer getTotalBillAmountToday();

}
