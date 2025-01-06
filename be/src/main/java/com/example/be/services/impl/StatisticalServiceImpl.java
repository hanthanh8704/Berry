package com.example.be.services.impl;

import com.example.be.dto.admin.request.statistical.FindBillDateRequest;
import com.example.be.dto.admin.response.statistical.*;
import com.example.be.repositories.admin.BillRepository;
import com.example.be.services.StatisticalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;

@Service
public class StatisticalServiceImpl implements StatisticalService {
    private final BillRepository billRepository;
    @Autowired
    public StatisticalServiceImpl(BillRepository billRepository) {
        this.billRepository = billRepository;
    }

    @Override
    public List<StatisticalDayResponse> getAllStatisticalDay() {
        return billRepository.getAllStatisticalDay(getStartOfToday(), getEndOfToday());
    }

    @Override
    public List<StatisticalWeekResponse> getAllStatisticalWeek() {
        return billRepository.getAllStatisticalWeek(getStartOfWeek(), getEndOfWeek());
    }

    @Override
    public List<StatisticalMonthlyResponse> getAllStatisticalMonth() {
        return billRepository.getAllStatisticalMonthly(getStartOfMonth(), getEndOfMonth());
    }

    @Override
    public List<StatisticaYearResponse> getStatisticalYear() {
        Calendar calendar = Calendar.getInstance();
        int currentYear = calendar.get(Calendar.YEAR);
        return billRepository.getAllStatisticalYear(currentYear);
    }

    @Override
    public List<StatisticalMonthlyResponse> getAllStatisticalYear() {
        return billRepository.getAllStatisticalMonthly(getStartOfYear(), getEndOfYear());
    }

    @Override
    public List<StatisticalDayResponse> getAllStatisticalDayPrevious() {
        return billRepository.getAllStatisticalDay(getStartOfYesterday(), getEndOfYesterday());
    }

    @Override
    public List<StatisticalMonthlyResponse> getAllStatisticalMonthPrevious() {
        return billRepository.getAllStatisticalMonthly(getStartOfPreviousMonth(), getEndOfPreviousMonth());
    }

    @Override
    public List<StatisticalMonthlyResponse> getAllStatisticalYearPrevious() {
        return billRepository.getAllStatisticalMonthly(getStartOfPreviousYear(), getEndOfPreviousYear());
    }
    @Override
    public List<StatisticalStatusBillResponse> getAllStatisticalStatusBill(FindBillDateRequest req) {
        if (req.getStartDate() == null && req.getEndDate() == null) {
            req.setStartDate(getStartOfMonth());
            req.setEndDate(getEndOfMonth());
            return billRepository.getAllStatisticalStatusBill(req);
        } else if (req.getStartDate() == null && req.getEndDate() != null) {
            req.setStartDate(getStartOfMonth());
            return billRepository.getAllStatisticalStatusBill(req);
        } else if (req.getStartDate() != null && req.getEndDate() == null) {
            req.setEndDate(getEndOfMonth());
            return billRepository.getAllStatisticalStatusBill(req);
        } else {
            return billRepository.getAllStatisticalStatusBill(req);
        }
    }

    @Override
    public List<StatisticalBestSellingProductResponse> getAllStatisticalBestSellingProduct(FindBillDateRequest req) {
        if (req.getStartDate() == null && req.getEndDate() == null) {
            req.setStartDate(getStartOfMonth());
            req.setEndDate(getEndOfMonth());
            return billRepository.getAllStatisticalBestSellingProduct(req);
        } else if (req.getStartDate() == null && req.getEndDate() != null) {
            req.setStartDate(getStartOfMonth());
            return billRepository.getAllStatisticalBestSellingProduct(req);
        } else if (req.getStartDate() != null && req.getEndDate() == null) {
            req.setEndDate(getEndOfMonth());
            return billRepository.getAllStatisticalBestSellingProduct(req);
        } else {
            return billRepository.getAllStatisticalBestSellingProduct(req);
        }
    }

    @Override
    public List<StatisticalBillDateResponse> getAllStatisticalBillDate(FindBillDateRequest req) {
        if (req.getStartDate() == null && req.getEndDate() == null) {
            req.setStartDate(getStartOfMonth());
            req.setEndDate(getEndOfMonth());
            return billRepository.getAllStatisticalBillDate(req);
        } else if (req.getStartDate() == null && req.getEndDate() != null) {
            req.setStartDate(getStartOfMonth());
            return billRepository.getAllStatisticalBillDate(req);
        } else if (req.getStartDate() != null && req.getEndDate() == null) {
            req.setEndDate(getEndOfMonth());
            return billRepository.getAllStatisticalBillDate(req);
        } else {
            return billRepository.getAllStatisticalBillDate(req);
        }
    }

    @Override
    public List<StatisticalProductDateResponse> getAllStatisticalProductDate(FindBillDateRequest req) {
        if (req.getStartDate() == null && req.getEndDate() == null) {
            req.setStartDate(getStartOfMonth());
            req.setEndDate(getEndOfMonth());
            return billRepository.getAllStatisticalProductDate(req);
        } else if (req.getStartDate() == null && req.getEndDate() != null) {
            req.setStartDate(getStartOfMonth());
            return billRepository.getAllStatisticalProductDate(req);
        } else if (req.getStartDate() != null && req.getEndDate() == null) {
            req.setEndDate(getEndOfMonth());
            return billRepository.getAllStatisticalProductDate(req);
        } else {
            return billRepository.getAllStatisticalProductDate(req);
        }
    }

    @Override
    public List<StatisticalBestSellingProductResponse> getAllStatisticalProductStock() {
        return billRepository.getAllStatisticalProductStock();
    }

    // Methods to get start and end of today, week, month, and year

    private Date getStartOfToday() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar.getTime();
    }

    private Date getEndOfToday() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.HOUR_OF_DAY, 23);
        calendar.set(Calendar.MINUTE, 59);
        calendar.set(Calendar.SECOND, 59);
        calendar.set(Calendar.MILLISECOND, 999);
        return calendar.getTime();
    }

    private Date getStartOfWeek() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_WEEK, Calendar.MONDAY);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar.getTime();
    }

    private Date getEndOfWeek() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_WEEK, Calendar.SUNDAY);
        calendar.set(Calendar.HOUR_OF_DAY, 23);
        calendar.set(Calendar.MINUTE, 59);
        calendar.set(Calendar.SECOND, 59);
        calendar.set(Calendar.MILLISECOND, 999);
        return calendar.getTime();
    }

    private Date getStartOfMonth() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_MONTH, 1);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar.getTime();
    }

    private Date getEndOfMonth() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMaximum(Calendar.DAY_OF_MONTH));
        calendar.set(Calendar.HOUR_OF_DAY, 23);
        calendar.set(Calendar.MINUTE, 59);
        calendar.set(Calendar.SECOND, 59);
        calendar.set(Calendar.MILLISECOND, 999);
        return calendar.getTime();
    }

    private Date getStartOfYear() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_YEAR, 1);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar.getTime();
    }

    private Date getEndOfYear() {
        Calendar calendar = Calendar.getInstance();
        calendar.set(Calendar.DAY_OF_YEAR, calendar.getActualMaximum(Calendar.DAY_OF_YEAR));
        calendar.set(Calendar.HOUR_OF_DAY, 23);
        calendar.set(Calendar.MINUTE, 59);
        calendar.set(Calendar.SECOND, 59);
        calendar.set(Calendar.MILLISECOND, 999);
        return calendar.getTime();
    }

    private Date getStartOfYesterday() {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_MONTH, -1);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar.getTime();
    }

    private Date getEndOfYesterday() {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.DAY_OF_MONTH, -1);
        calendar.set(Calendar.HOUR_OF_DAY, 23);
        calendar.set(Calendar.MINUTE, 59);
        calendar.set(Calendar.SECOND, 59);
        calendar.set(Calendar.MILLISECOND, 999);
        return calendar.getTime();
    }

    private Date getStartOfPreviousMonth() {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.MONTH, -1);
        calendar.set(Calendar.DAY_OF_MONTH, 1);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar.getTime();
    }

    private Date getEndOfPreviousMonth() {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.MONTH, -1);
        calendar.set(Calendar.DAY_OF_MONTH, calendar.getActualMaximum(Calendar.DAY_OF_MONTH));
        calendar.set(Calendar.HOUR_OF_DAY, 23);
        calendar.set(Calendar.MINUTE, 59);
        calendar.set(Calendar.SECOND, 59);
        calendar.set(Calendar.MILLISECOND, 999);
        return calendar.getTime();
    }

    private Date getStartOfPreviousYear() {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.YEAR, -1);
        calendar.set(Calendar.DAY_OF_YEAR, 1);
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
        return calendar.getTime();
    }

    private Date getEndOfPreviousYear() {
        Calendar calendar = Calendar.getInstance();
        calendar.add(Calendar.YEAR, -1);
        calendar.set(Calendar.DAY_OF_YEAR, calendar.getActualMaximum(Calendar.DAY_OF_YEAR));
        calendar.set(Calendar.HOUR_OF_DAY, 23);
        calendar.set(Calendar.MINUTE, 59);
        calendar.set(Calendar.SECOND, 59);
        calendar.set(Calendar.MILLISECOND, 999);
        return calendar.getTime();
    }
}
