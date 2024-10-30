package com.example.be.services;

import com.example.be.dto.admin.response.billhistory.BillHistoryResponse;
import com.example.be.entities.BillHistory;

import java.util.List;

/**
 * @author hanthanh
 */

public interface BillHistoryService {


    List<BillHistoryResponse> getByBill(Integer idBill);
}
