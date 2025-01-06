package com.example.be.dto.admin.response.statistical;


import org.springframework.beans.factory.annotation.Value;

import java.time.LocalDate;

/**
 * @author hanthanh
 */
public interface StatisticalProductDateResponse {
    @Value("#{target.billDate}")
    LocalDate getBillDate();

    @Value("#{target.totalProductDate}")
    Integer getTotalProductDate();
}
