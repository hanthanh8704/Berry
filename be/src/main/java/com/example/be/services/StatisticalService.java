package com.example.be.services;

import com.example.be.dto.admin.request.statistical.*;
import com.example.be.dto.admin.response.statistical.*;

import java.util.List;

public interface StatisticalService {
    List<StatisticalDayResponse> getAllStatisticalDay();

    // week
    List<StatisticalWeekResponse> getAllStatisticalWeek();

    List<StatisticalMonthlyResponse> getAllStatisticalMonth();

    List<StatisticaYearResponse> getStatisticalYear();

    List<StatisticalMonthlyResponse> getAllStatisticalYear();

    List<StatisticalDayResponse> getAllStatisticalDayPrevious();

    List<StatisticalMonthlyResponse> getAllStatisticalMonthPrevious();

    List<StatisticalMonthlyResponse> getAllStatisticalYearPrevious();

    List<StatisticalStatusBillResponse> getAllStatisticalStatusBill(FindBillDateRequest findBillDateRequest);

    List<StatisticalBestSellingProductResponse> getAllStatisticalBestSellingProduct(FindBillDateRequest findBillDateRequest);

    List<StatisticalBillDateResponse> getAllStatisticalBillDate(FindBillDateRequest findBillDateRequest);

    List<StatisticalProductDateResponse> getAllStatisticalProductDate(FindBillDateRequest findBillDateRequest);

    List<StatisticalBestSellingProductResponse> getAllStatisticalProductStock();

}
